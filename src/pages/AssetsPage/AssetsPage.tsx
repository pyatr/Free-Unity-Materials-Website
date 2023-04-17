import {Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import ServerConnection from "../../utils/ServerConnection";
import {AxiosResponse} from "axios";
import {IsMobileResolution} from "../../utils/MobileUtilities";

type AssetItem = {
    NUMBER: number,
    TITLE: string,
    SHORTTITLE: string,
    CATEGORIES: string,
    CREATION_DATE: string,
    TITLEPIC_LINK: string
}

export default function AssetsPage() {
    const [rawContent, setRawContent] = useState(null);
    let itemDimensions = IsMobileResolution() ? [240, 384] : [160, 256];
    const sizeRatio = 0.625;

    const landscapeRowColumnCount = [2, 6];
    const mobileRowColumnCount = [4, 2];
    const rcCount = IsMobileResolution() ? mobileRowColumnCount : landscapeRowColumnCount;

    const pageSize = rcCount[0] * rcCount[1];
    const page = 1;

    let rowSpacing = 0;

    let mainBox = document.getElementById("mainElementBox");

    if (mainBox != null) {
        let boxWidth = (mainBox as HTMLElement).getBoundingClientRect().width;
        itemDimensions[0] = boxWidth / (rcCount[1] + 1);
        itemDimensions[1] = itemDimensions[0] / sizeRatio;

        rowSpacing = ((mainBox as HTMLElement).getBoundingClientRect().height - itemDimensions[1] * rcCount[0]);
    }

    const boxStyle = {
        width: itemDimensions[0] + 'px',
        height: itemDimensions[1] + 'px',
        margin: "auto",
        border: 2,
        borderColor: 'primary.main',
        borderRadius: 1
    };

    let preparedContent: JSX.Element[] = [];
    useEffect(() => {
        const waitForContent = async () => {
            if (rawContent != null)
                return;
            let scon = new ServerConnection();
            let params = {
                pageSize: pageSize,
                page: page
            };
            await scon.sendPostRequest("getPosts", params,
                (response: AxiosResponse) => {
                    //Use response.data.code for SQL request code and response.data.requesterror for error details
                    if (response.data.result === "success") {
                        setRawContent(response.data.content);
                    } else {
                        console.log("request failed: " + response.data.code + "\nError: " + response.data.requesterror);
                    }
                });
        }
        waitForContent();
    });

    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight]);

    const updateWidthAndHeight = () => {
        setWidthHeight([window.innerWidth, window.innerHeight]);
    };

    useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });

    if (rawContent == null) {
        return (<Typography variant="h4">Loading assets...</Typography>);
    } else {
        preparedContent = (rawContent as Array<AssetItem>).map((item) => {
            return (<Grid item style={boxStyle}>
                {<img src={item.TITLEPIC_LINK} width={boxStyle.width} height={boxStyle.width}/>}
            </Grid>);

        });
        return (<Grid container rowSpacing={rowSpacing + "px"}>{preparedContent}</Grid>);
    }
}
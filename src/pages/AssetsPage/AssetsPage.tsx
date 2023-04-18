import {Grid, Typography} from "@mui/material";
import React, {Fragment, useEffect, useState} from "react";
import ServerConnection from "../../utils/ServerConnection";
import {AxiosResponse} from "axios";
import {IsMobileResolution} from "../../utils/MobileUtilities";
import AssetItemDisplay from "../../components/AssetItemDisplay";
import {SitePages} from "../../utils/PageData/PageData";

export type AssetItem = {
    NUMBER: number,
    TITLE: string,
    SHORTTITLE: string,
    CATEGORIES: string,
    CREATION_DATE: string,
    TITLEPIC_LINK: string
}

export default function AssetsPage() {
    const [rawContent, setRawContent] = useState(Array<AssetItem>);
    let itemDimensions = IsMobileResolution() ? [240, 384] : [160, 256];
    const sizeRatio = 0.7;
    let elementPageData = SitePages.page["AssetsPage"];

    const rcCount = IsMobileResolution() ? elementPageData.mobileRowColumnCount : elementPageData.landscapeRowColumnCount;

    let mainBox = document.getElementById("mainElementBox");

    if (mainBox != null) {
        let boxWidth = (mainBox as HTMLElement).getBoundingClientRect().width;
        itemDimensions[0] = boxWidth / (rcCount[1] + 1);
        itemDimensions[1] = itemDimensions[0] / sizeRatio;
    }

    const boxStyle = {
        width: itemDimensions[0] + 'px',
        height: itemDimensions[1] + 'px',
        margin: "auto",
        border: 2,
        borderStyle: "solid",
        borderColor: "primary.main"
    };

    useEffect(() => {
        const waitForContent = async () => {
            if (rawContent.length > 0)
                return;
            let scon = new ServerConnection();
            let params = {
                pageSize: elementPageData.pageSize,
                page: elementPageData.currentPage
            };
            await scon.sendPostRequest("getPosts", params,
                (response: AxiosResponse) => {
                    //Use response.data.code for SQL request code and response.data.requesterror for error details
                    if (response.data.result === "success") {
                        (response.data.content as AssetItem[]).forEach(assItem => assItem.TITLEPIC_LINK = "http://" + window.location.host + assItem.TITLEPIC_LINK)
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

    if (rawContent.length == 0) {
        return (<Typography variant="h4">Loading assets...</Typography>);
    } else {
        let slicedPreparedContent: JSX.Element[][] = [];

        for (let i = 0; i < rcCount[0]; i++) {
            let offset = i * rcCount[1];
            let count = offset + rcCount[1];
            slicedPreparedContent.push(rawContent.slice(offset, count).map((item) => (
                <AssetItemDisplay itemData={item} itemStyle={boxStyle}/>)));
        }

        let preparedContent = slicedPreparedContent.map((line) => {
            return (<Fragment><Grid container>{line}</Grid><br/></Fragment>);
        });
        return (<Grid>{preparedContent}</Grid>);
    }
}
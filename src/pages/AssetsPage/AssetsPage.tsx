import {Box, Button, Grid, Typography} from "@mui/material";
import React, {Fragment, ReactNode, useEffect, useState} from "react";
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
    const landscapeRowColumnCount = [2, 6];
    const mobileRowColumnCount = [4, 2];
    const rcCount = IsMobileResolution() ? mobileRowColumnCount : landscapeRowColumnCount;
    const pageSize = rcCount[0] * rcCount[1];
    const page = 1;
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

    if (rawContent == null) {
        return (<Typography variant="h4">Loading assets...</Typography>);
    } else {
        let itemSpacing = 24;
        let itemDimensions = [160, 256];
        const mainBox = document.getElementById("mainElementBox");
        let spaceToItemRatio = 0.150;
        let sizeRatio = 0.625;
        if (mainBox != null) {
            let boxWidth = mainBox.getBoundingClientRect().width;
            itemDimensions[0] = boxWidth / (rcCount[1]);
            itemDimensions[1] = itemDimensions[0] / sizeRatio;
            itemSpacing = itemDimensions[0] * spaceToItemRatio;
            itemDimensions[0] = itemDimensions[0] - itemSpacing;
            itemDimensions[1] = itemDimensions[1] - itemSpacing;
        }
        const boxStyle = {
            width: itemDimensions[0] + 'px',
            height: itemDimensions[1] + 'px',
            alignSelf: "normal",
            border: 2,
            borderColor: 'primary.main',
            borderRadius: 1
        };

        preparedContent = (rawContent as Array<AssetItem>).map((item) => {
            return (<Grid item>
                <Box style={boxStyle}>
                    {<img src={item.TITLEPIC_LINK} width={boxStyle.width} height={boxStyle.width}/>}
                </Box>
            </Grid>);

        });
        return (<Grid container columns={rcCount[1]} spacing={itemSpacing + "px"}>{preparedContent}</Grid>);
    }
}
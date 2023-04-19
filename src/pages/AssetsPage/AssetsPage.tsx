import {Grid, Typography} from "@mui/material";
import React, {Fragment, useEffect, useState} from "react";
import ServerConnection from "../../utils/ServerConnection";
import {AxiosResponse} from "axios";
import {IsMobileResolution} from "../../utils/MobileUtilities";
import AssetItemDisplay from "../../components/AssetItemDisplay";
import {PageData, PageLoadProps} from "../../utils/PageData/PageData";

export type AssetItem = {
    NUMBER: number,
    TITLE: string,
    SHORTTITLE: string,
    CATEGORIES: string,
    CREATION_DATE: string,
    CONTENT: string,
    TITLEPIC_LINK: string
}

function GetItemStyle(pageData: PageData): Array<any> {
    let itemDimensions = IsMobileResolution() ? [240, 384] : [160, 256];
    const sizeRatio = 0.575;

    const rcCount = IsMobileResolution() ? pageData.mobileRowColumnCount : pageData.landscapeRowColumnCount;

    let mainBox = document.getElementById("mainElementBox");

    if (mainBox != null) {
        let boxWidth = (mainBox as HTMLElement).getBoundingClientRect().width;
        itemDimensions[0] = boxWidth / (rcCount[1] + 1);
        itemDimensions[1] = itemDimensions[0] / sizeRatio;
    }

    return ([{
        width: itemDimensions[0] + 'px',
        height: itemDimensions[1] + 'px',
        margin: "auto",
        border: 2,
        borderStyle: "solid",
        borderColor: "primary.main"
    }, rcCount]);
}

export default function AssetsPage({pageData, onPageLoaded}: PageLoadProps) {
    const [rawContent, setRawContent] = useState(Array<AssetItem>);
    const [boxStyle, rcCount] = GetItemStyle(pageData);

    useEffect(() => {
        const waitForContent = async () => {
            //Do not reload content if its loaded and if page was not told to update
            if (rawContent.length > 0 && !pageData.shouldUpdate) {
                return;
            }
            pageData.shouldUpdate = false;
            let scon = new ServerConnection();
            let params = {
                pageSize: pageData.pageSize,
                page: pageData.currentPage
            };
            await scon.sendPostRequest("getPosts", params,
                (response: AxiosResponse) => {
                    //Use response.data.code for SQL request code and response.data.requesterror for error details
                    if (response.data.result === "success") {
                        (response.data.content as AssetItem[]).forEach(assItem => assItem.TITLEPIC_LINK = "http://" + window.location.host + assItem.TITLEPIC_LINK);
                        pageData.setPostsCount(response.data.postsCount);
                        window.scrollTo(0, 0);
                        setRawContent(response.data.content);
                    } else {
                        console.log("request failed: " + response.data.code + "\nError: " + response.data.requesterror);
                    }
                });
        }
        waitForContent();
    });

    if (rawContent.length == 0) {
        return (<Typography variant="h4">Loading assets...</Typography>);
    } else {
        let slicedPreparedContent: JSX.Element[][] = [];

        let realRowCount = Math.max(1, Math.ceil(rawContent.length / rcCount[1]));
        for (let i = 0; i < realRowCount; i++) {
            let offset = i * rcCount[1];
            let count = offset + rcCount[1];
            let slice: AssetItem[] = rawContent.slice(offset, count);
            let realLength = slice.length;
            slice.length += rcCount[1] - realLength;
            for (let j = realLength; j < slice.length; j++) {
                slice[j] = structuredClone(slice[0]);
                slice[j].NUMBER = -1;
            }
            slicedPreparedContent.push(slice.map((item) => (
                <AssetItemDisplay itemData={item} itemStyle={boxStyle}/>)));
        }

        let preparedContent = slicedPreparedContent.map((line) => {
            return (<Fragment><Grid container>{line}</Grid><br/></Fragment>);
        });
        onPageLoaded(true);
        return (<Grid>{preparedContent}</Grid>);
    }
}
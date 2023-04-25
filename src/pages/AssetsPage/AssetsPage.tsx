import {Grid, Typography} from "@mui/material";
import React, {Fragment} from "react";
import {IsMobileResolution} from "../../utils/MobileUtilities";
import AssetItemDisplay from "../../components/AssetItemDisplay";
import {PageData, PageLoadProps} from "../../utils/PageData/PageData";
import {ContentItem} from "../../utils/ContentItem";
import {ContentPreview} from "../../utils/ContentPreview";

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
        borderColor: "primary.main",
        color: "black",
        textDecoration: "none",
        boxSizing: "content-box"
    }, rcCount]);
}

export default function AssetsPage({pageData, rawContent}: PageLoadProps) {
    const [boxStyle, rcCount] = GetItemStyle(pageData);

    if (rawContent.length > 0) {
        let slicedPreparedContent: JSX.Element[][] = [];

        let realRowCount = Math.max(1, Math.ceil(rawContent.length / rcCount[1]));
        for (let i = 0; i < realRowCount; i++) {
            let offset = i * rcCount[1];
            let count = offset + rcCount[1];
            let slice: ContentPreview[] = rawContent.slice(offset, count);
            let realLength = slice.length;
            slice.length += rcCount[1] - realLength;
            for (let j = realLength; j < slice.length; j++) {
                //Create dummy elements for dynamic grid in case there are not enough items in row
                slice[j] = {
                    NUMBER: -1,
                    SHORTTITLE: "",
                    CATEGORIES: "",
                    CONTENT: "",
                    TITLEPIC_LINK: ""
                }
            }
            slicedPreparedContent.push(slice.map((item) => (
                <AssetItemDisplay itemData={item} itemStyle={boxStyle}/>)));
        }

        let preparedContent = slicedPreparedContent.map((line) => {
            return (<Fragment><Grid container>{line}</Grid><br/></Fragment>);
        });
        return (<Grid>{preparedContent}</Grid>);
    } else {
        return (<Typography variant="h4">Loading assets...</Typography>);
    }
}
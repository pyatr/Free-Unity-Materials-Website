import {Grid, Typography} from "@mui/material";
import React, {Fragment} from "react";
import {IsMobileResolution} from "../../utils/MobileUtilities";
import AssetItemDisplay from "../../components/AssetItemDisplay";
import {PageLoadProps, PageParameters} from "../../utils/PageParameters/PageParameters";

function GetItemStyle(pageParameters: PageParameters): React.CSSProperties {
    let itemDimensions = IsMobileResolution() ? [240, 384] : [160, 256];
    const sizeRatio = 0.575;

    const rowColumnCount = IsMobileResolution() ? pageParameters.mobileRowColumnCount : pageParameters.landscapeRowColumnCount;

    let mainBox = document.getElementById("mainElementBox");

    if (mainBox != null) {
        let boxWidth = (mainBox as HTMLElement).getBoundingClientRect().width;
        itemDimensions[0] = boxWidth / (rowColumnCount[1] + 1);
        itemDimensions[1] = itemDimensions[0] / sizeRatio;
    }
    const width = 90 / rowColumnCount[1];
    return ({
        width: itemDimensions[0] + "px",
        height: itemDimensions[1] + "px",
        border: "2px",
        borderStyle: "solid",
        borderColor: "primary.main",
        color: "black",
        textDecoration: "none",
        boxSizing: "content-box"
    });
}

export default function AssetsPage({pageData, rawContent}: PageLoadProps) {
    const boxStyle = GetItemStyle(pageData);

    if (rawContent.length > 0) {
        const gridStyle = {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            rowGap: "32px"
        }

        let preparedContent = rawContent.map((previewData) => {
            return (<AssetItemDisplay itemData={previewData} itemStyle={boxStyle}/>);
        });
        return (<Grid sx={gridStyle}>{preparedContent}</Grid>);
    } else {
        return (<Typography variant="h4">Loading assets...</Typography>);
    }
}
import {Grid, Typography} from "@mui/material";
import React, {Fragment} from "react";
import {IsMobileResolution} from "../../utils/MobileUtilities";
import AssetUnitPreview from "./AssetUnitPreview";
import {PageLoadProps, PageParameters} from "../../utils/PageParameters/PageParameters";
import {GetDummyContentUnit} from "../../utils/Types/Content/ContentUnit";
import {GetDummyPreview} from "../../utils/Types/Content/ContentUnitPreview";

function GetItemStyle(pageParameters: PageParameters): React.CSSProperties {
    let previewDisplayDimensions = IsMobileResolution() ? [240, 384] : [160, 256];
    const sizeRatio = 0.575;

    const rowColumnCount = IsMobileResolution() ? pageParameters.mobileRowColumnCount : pageParameters.landscapeRowColumnCount;

    let mainBox = document.getElementById("mainElementBox");

    if (mainBox != null) {
        let boxWidth = (mainBox as HTMLElement).getBoundingClientRect().width;
        previewDisplayDimensions[0] = boxWidth / (rowColumnCount[1] + 1);
        previewDisplayDimensions[1] = previewDisplayDimensions[0] / sizeRatio;
    }

    return ({
        width: previewDisplayDimensions[0] + "px",
        height: previewDisplayDimensions[1] + "px",
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
            justifyContent: "space-between",
            rowGap: "32px",
            paddingLeft: "16px",
            paddingRight: "16px"
        }
        for (let i = rawContent.length; i < pageData.pageSize; i++) {
            rawContent.push(GetDummyPreview());
        }
        let preparedContent = rawContent.map((previewData) => {
            return (<AssetUnitPreview contentUnitPreview={previewData} contentUnitPreviewStyle={boxStyle}/>);
        });
        return (<Grid sx={gridStyle}>{preparedContent}</Grid>);
    } else {
        return (<Typography variant="h4">Loading assets...</Typography>);
    }
}
import {Grid} from "@mui/material";
import React from "react";
import AssetUnitPreview from "./AssetUnitPreview";
import {PageLoadProps} from "../../utils/PageParameters/PageProperties";
import {GetDummyPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {LoadingOverlay} from "../../components/LoadingOverlay";

export default function AssetsPage({pageProperties, previewContent}: PageLoadProps) {
    if (previewContent.length > 0 && pageProperties != undefined) {
        const gridStyle = {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: "32px",
            paddingLeft: "16px",
            paddingRight: "16px"
        }
        for (let i = previewContent.length; i < pageProperties.pageSize; i++) {
            previewContent.push(GetDummyPreview());
        }
        let preparedContent = previewContent.map((previewData) => {
            return (<AssetUnitPreview contentUnitPreview={previewData}/>);
        });
        return (<Grid sx={gridStyle}>{preparedContent}</Grid>);
    } else {
        return (<LoadingOverlay position={"inherit"}/>);
    }
}
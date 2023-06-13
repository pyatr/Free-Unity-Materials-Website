import {Grid} from "@mui/material";
import React from "react";
import AssetUnitPreview from "./AssetUnitPreview";
import {PageLoadProps} from "../../utils/PageProperties/PageProperties";
import {GetDummyPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {LoadingOverlay} from "../../components/LoadingOverlay";

export default function AssetsPreviewGridPage({pageProperties, previewContent}: PageLoadProps) {
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
        let uniqueKey = 0;
        let preparedContent = previewContent.map((previewData) => {
            uniqueKey++;
            return (<AssetUnitPreview key={uniqueKey.toString()} contentUnitPreview={previewData}/>);
        });
        return (
            <Grid id="assetsPreview" sx={gridStyle}>
                {preparedContent}
            </Grid>);
    } else {
        return (<LoadingOverlay position={"inherit"}/>);
    }
}
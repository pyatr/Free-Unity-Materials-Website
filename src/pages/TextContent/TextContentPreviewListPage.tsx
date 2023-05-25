import {Grid} from "@mui/material";
import React from "react";
import {PageLoadProps} from "../../utils/PageProperties/PageProperties";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import TextContentUnitPreview from "./TextContentUnitPreview";

export default function TextContentPreviewListPage({pageProperties, previewContent}: PageLoadProps) {
    if (previewContent.length > 0 && pageProperties != undefined) {
        const gridStyle = {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: "32px",
            paddingLeft: "16px",
            paddingRight: "16px"
        }
        let preparedContent = previewContent.map((previewData) => {
            return (<TextContentUnitPreview
                requestedContentCategory={pageProperties.getCategoryName()}
                contentUnitPreview={previewData}/>);
        });
        return (
            <Grid sx={gridStyle}>
                {preparedContent}
            </Grid>);
    } else {
        return (<LoadingOverlay position={"inherit"}/>);
    }
}
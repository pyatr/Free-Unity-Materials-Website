import {PageLoadProps} from "../../utils/PageProperties/PageProperties";
import TextContentUnitPreview from "../TextContent/TextContentUnitPreview";
import {Grid} from "@mui/material";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import React from "react";
import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";

const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: "32px",
    paddingLeft: "16px",
    paddingRight: "16px"
}

export function AllContentPreviewListPage({pageProperties, previewContent}: PageLoadProps) {
    if (previewContent.length > 0 && pageProperties !== undefined) {
        let preparedContent = previewContent.map((previewData: ContentUnitPreview) => {
            return (<TextContentUnitPreview key={previewData.contentID} contentUnitPreview={previewData}/>);
        });
        return (
            <Grid sx={gridStyle}>
                {preparedContent}
            </Grid>);
    } else {
        return (<LoadingOverlay position={"inherit"}/>);
    }
}
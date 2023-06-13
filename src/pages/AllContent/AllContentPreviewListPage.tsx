import {PageLoadProps, PageProperties} from "../../utils/PageProperties/PageProperties";
import TextContentUnitPreview from "../TextContent/TextContentUnitPreview";
import {Grid} from "@mui/material";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import React from "react";
import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {SitePagesProperties} from "../../utils/PageProperties/SitePagesProperties";

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
        const pageProperties: PageProperties = SitePagesProperties.page["AllContentPage"];
        const postsOffset: number = pageProperties.pageSize * (pageProperties.currentPage - 1);
        previewContent = previewContent.slice(postsOffset, postsOffset + pageProperties.pageSize);
        let preparedContent = previewContent.map((previewData: ContentUnitPreview) => {
            return (<TextContentUnitPreview
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
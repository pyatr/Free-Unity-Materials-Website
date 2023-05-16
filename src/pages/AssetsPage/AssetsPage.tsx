import {Grid} from "@mui/material";
import React from "react";
import AssetUnitPreview from "./AssetUnitPreview";
import {PageLoadProps} from "../../utils/PageProperties/PageProperties";
import {GetDummyPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import ContentPageSwitch from "../../components/MainPage/ContentPageSwitch";

export default function AssetsPage({
                                       pageProperties,
                                       previewContent,
                                       onClickBack,
                                       onClickForward,
                                       onClickNum
                                   }: PageLoadProps) {
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
        return (
            <Grid id="assetsPreview" sx={gridStyle}>
                {preparedContent}
                <ContentPageSwitch pageProperties={pageProperties}
                                   previewContent={previewContent}
                                   onClickBack={onClickBack}
                                   onClickForward={onClickForward}
                                   onClickNum={onClickNum}/>
            </Grid>);
    } else {
        return (<LoadingOverlay position={"inherit"}/>);
    }
}
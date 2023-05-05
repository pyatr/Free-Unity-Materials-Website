import {Grid, Typography} from "@mui/material";
import React, {Fragment, useState} from "react";
import {AddCircle, AddCircleOutline} from "@mui/icons-material";
import ContentCategorySelectionMenu, {CategorySelectionProps} from "../../pages/ContentEdit/ContentCategorySelectionMenu";

const categoryButtonStyle = {
    cursor: 'pointer',
    minWidth: "24px",
    minHeight: "24px",
    height: "24px",
    width: "24px"
}

export function ContentCategorySelection({contentUnitCategories, onCategorySelected}: CategorySelectionProps) {
    //Displaying category selection menu
    const [isCategorySelectionDisplayed, setCategorySelectionDisplay] = useState(false);

    return (
        <Grid
            style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                width: "fit-content",
                height: "24px",
                maxHeight: "24px"
            }}>
            {contentUnitCategories == "" ?
                <Typography variant="subtitle2" fontStyle="italic">Choose categories</Typography> :
                <Typography variant="subtitle2">{contentUnitCategories}</Typography>}
            {isCategorySelectionDisplayed ?
                <Fragment>
                    <AddCircle
                        style={categoryButtonStyle}
                        onClick={() => setCategorySelectionDisplay(!isCategorySelectionDisplayed)}/>
                    <ContentCategorySelectionMenu
                        contentUnitCategories={contentUnitCategories}
                        onCategorySelected={onCategorySelected}/>
                </Fragment> :
                <AddCircleOutline
                    style={categoryButtonStyle}
                    onClick={() => setCategorySelectionDisplay(!isCategorySelectionDisplayed)}/>}
        </Grid>);
}
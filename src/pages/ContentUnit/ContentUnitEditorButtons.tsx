import {Button, Grid} from "@mui/material";
import React, {Fragment} from "react";
import {Link} from "react-router-dom";

import {sideButtonStyle} from "../../components/Layouts/MainContentLayout";
import {CanUserEditContent} from "../../utils/User/Login";

type ContentEditButtonsProps = {
    contentID: number
    onDelete: Function,
    requestedContentCategory: string
}

const mainGridStyle = {
    display: "flex",
    paddingTop: "16px",
    gap: "16px",
    width: "100%",
    justifyContent: "space-between"
}

export default function ContentUnitEditorButtons({
                                                     contentID,
                                                     onDelete,
                                                     requestedContentCategory
                                                 }: ContentEditButtonsProps) {
    if (CanUserEditContent()) {
        const linksForCategories = [["asset", ""], ["article", "/articles"], ["script", "/scripts"]];
        const chosenLink = linksForCategories.filter(linkCategoryPair => linkCategoryPair[0] === requestedContentCategory)[0][1];
        return (
            <Grid style={mainGridStyle}>
                {/*Left grid*/}
                <Grid style={{display: "flex", gap: "16px"}}>
                    <Button component={Link}
                            to={chosenLink + "/edit/" + contentID}
                            style={sideButtonStyle}>Edit</Button>
                </Grid>
                {/*Right grid*/}
                <Grid style={{display: "flex", gap: "16px"}}>
                    <Button onClick={() => onDelete()} style={sideButtonStyle}>Delete</Button>
                </Grid>
            </Grid>);
    } else {
        return <Fragment/>;
    }
}
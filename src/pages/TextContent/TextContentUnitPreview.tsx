import React, {Fragment, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";

import "../../assets/HomePage.css";

import DeleteContent from "../../utils/ContentInteraction/DeleteContent";
import {GoToHomePage} from "../../utils/GoToHomePage";
import MessageBoxYesNo from "../../components/MessageBoxes/MessageBoxYesNo";
import ContentUnitEditorButtons from "../ContentUnit/ContentUnitEditorButtons";
import {StripHTMLFromString} from "../../utils/Strings/StripHTMLFromString";
import {GetCommentCount} from "../../utils/Comments/GetCommentCount";
import {ContentUnitPreview} from "../../utils/Types/Content/ContentUnitPreview";
import {Link, useSearchParams} from "react-router-dom";

const outerGrid = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid',
    border: "1px",
    borderStyle: "solid",
    borderRadius: "2px",
    padding: "8px"
}

const innerGrid = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid',
    textDecoration: "none"
}

const textBoxLink = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    color: "rgba(255,255,255,0)"
}

type TextContentPreviewProps = {
    contentUnitPreview: ContentUnitPreview
}

export default function TextContentUnitPreview({
                                                   contentUnitPreview
                                               }: TextContentPreviewProps) {
    const [deleteWindowOpen, setDeleteWindowStatus] = useState(false);
    const [commentCount, setCommentCount] = useState(-1);

    useEffect(() => getCommentCount());

    const getCommentCount = () => {
        if (commentCount == -1) {
            GetCommentCount(contentUnitPreview.contentID, contentUnitPreview.primaryCategory).then((commentCount: number) => setCommentCount(commentCount));
        }
    }

    const openDeleteWindow = () => setDeleteWindowStatus(true);

    const closeDeleteWindow = () => setDeleteWindowStatus(false);

    const confirmDelete = () => DeleteContent(contentUnitPreview.contentID, contentUnitPreview.primaryCategory).then(() => GoToHomePage());

    const linksForCategories = [["asset", ""], ["article", "/articles"], ["script", "/scripts"]];
    const chosenLink = linksForCategories.filter(linkCategoryPair => linkCategoryPair[0] === contentUnitPreview.primaryCategory)[0][1];

    const link = chosenLink + "/view/" + contentUnitPreview.contentID;

    return (
        <Grid sx={outerGrid}>
            {deleteWindowOpen ?
                <MessageBoxYesNo
                    message={"Delete " + contentUnitPreview.title + "?"}
                    onConfirm={confirmDelete}
                    onCancel={closeDeleteWindow}
                    parentWidth={"512px"}
                    parentHeight={"512px"}/> :
                <Fragment/>}
            <Grid sx={innerGrid}
                  component={Link}
                  to={link}>
                <Typography variant="h5"
                            sx={{marginBottom: "4px", color: "black"}}>{contentUnitPreview.title}</Typography>
                {contentUnitPreview.categories != "" ?
                    <Typography variant="subtitle2" sx={{color: "grey"}}>{contentUnitPreview.categories}</Typography> :
                    <Fragment/>}
                <Typography variant="body1"
                            sx={{color: "black"}}>{StripHTMLFromString(contentUnitPreview.body)}</Typography>
                {commentCount > -1 ?
                    <Typography variant="subtitle2"
                                color="grey">{(commentCount == 0 ? "No" : commentCount) + " comments"}</Typography> :
                    <Typography variant="subtitle2" color="white">{"Loading comments"}</Typography>}
            </Grid>
            <ContentUnitEditorButtons contentID={contentUnitPreview.contentID}
                                      onDelete={openDeleteWindow}
                                      requestedContentCategory={contentUnitPreview.primaryCategory}/>
        </Grid>);
}
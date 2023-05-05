import React, {Fragment, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";
import parse from 'html-react-parser';

import "../../assets/HomePage.css";

import {ContentUnit, GetDummyContentUnit} from "../../utils/Types/Content/ContentUnit";
import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";
import ImageGallery, {imageBoxStyle} from "../../components/ImageGallery/ImageGallery";
import DeleteContent from "../../utils/ContentInteraction/DeleteContent";
import {GoToHomePage} from "../../utils/GoToHomePage";
import DownloadLinksList from "../../components/DownloadLinks/DownloadLinksList";
import {CommentSection} from "../../components/Comments/CommentSection";
import ContentUnitEditorButtons from "./ContentUnitEditorButtons";
import {GetContentUnit} from "../../utils/ContentInteraction/GetContentUnit";

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

export default function ContentUnitPage({requestedContentID, requestedContentCategory}: ContentUnitRequestData) {
    const [contentUnit, setContentUnit] = useState(GetDummyContentUnit());

    const loadContent = () => {
        if (contentUnit.contentID == -1) {
            GetContentUnit(requestedContentID, requestedContentCategory).then((conItem: ContentUnit) => setContentUnit(conItem));
        }
    }

    useEffect(() => {
        loadContent();
    });

    if (contentUnit.contentID == -1) {
        return (<Fragment/>);
    }

    window.scrollTo(0, 0);

    const confirmDelete = () => DeleteContent(contentUnit.contentID, requestedContentCategory).then(() => GoToHomePage());

    const images = contentUnit.galleryImageLinks.map((link: string) =>
        (<Grid key={link} sx={imageBoxStyle}> <img src={link}/> </Grid>));

    let contentBody = parse(contentUnit.body);

    return (
        <Grid sx={itemContentDisplay}>
            <Typography variant="h3">{contentUnit.title}</Typography>
            {contentUnit.categories != "" ?
                <Typography variant="subtitle2" color="grey">{contentUnit.categories}</Typography> :
                <Fragment/>}
            <ImageGallery images={images}/>
            <DownloadLinksList links={contentUnit.fileLinks}/>
            <Typography sx={itemContentDisplay} variant="body1">{contentBody}</Typography>
            <ContentUnitEditorButtons contentID={contentUnit.contentID} onDelete={confirmDelete}/>
            <CommentSection requestedContentID={contentUnit.contentID}
                            requestedContentCategory={requestedContentCategory}></CommentSection>
        </Grid>);
}
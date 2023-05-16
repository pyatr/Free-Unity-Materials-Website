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
import MessageBoxYesNo from "../../components/MessageBoxes/MessageBoxYesNo";
import {useParams} from "react-router-dom";
import {LoadingOverlay} from "../../components/LoadingOverlay";

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

export default function ContentUnitPage({requestedContentID, requestedContentCategory}: ContentUnitRequestData) {
    const [contentUnit, setContentUnit] = useState(GetDummyContentUnit());
    const [deleteWindowOpen, setDeleteWindowStatus] = useState(false);
    const [isLoading, setLoadingStatus] = useState(false);

    let {currentContentID} = useParams();

    const loadContent = () => {
        if (contentUnit.contentID == -1 && !isLoading) {
            setLoadingStatus(true);
            GetContentUnit(parseInt(currentContentID as string), requestedContentCategory).then((loadedContentUnit: ContentUnit) => {
                window.scrollTo(0, 0);
                setLoadingStatus(false);
                setContentUnit(loadedContentUnit);
            });
        }
    }

    useEffect(() => loadContent());

    if (isLoading) {
        return (<LoadingOverlay position={"inherit"}/>);
    }

    const openDeleteWindow = () => setDeleteWindowStatus(true);

    const closeDeleteWindow = () => setDeleteWindowStatus(false);

    const confirmDelete = () => DeleteContent(contentUnit.contentID, requestedContentCategory).then(() => GoToHomePage());

    const mapImage = (currentLink: string, onClick: Function) =>
        (<Grid key={currentLink} sx={imageBoxStyle}>
            <img src={currentLink} onClick={() => onClick()}/>
        </Grid>);

    let contentBody = parse(contentUnit.body);

    return (
        <Grid sx={itemContentDisplay}>
            {deleteWindowOpen ?
                <MessageBoxYesNo
                    message={"Delete " + contentUnit.title + "?"}
                    onConfirm={confirmDelete}
                    onCancel={closeDeleteWindow}
                    parentWidth={"512px"}
                    parentHeight={"512px"}/> :
                <Fragment/>}
            <Typography variant="h3">{contentUnit.title}</Typography>
            {contentUnit.categories != "" ?
                <Typography variant="subtitle2" color="grey">{contentUnit.categories}</Typography> :
                <Fragment/>}
            <ImageGallery imageLinks={contentUnit.galleryImageLinks} imageMapper={mapImage}/>
            <DownloadLinksList links={contentUnit.fileLinks}/>
            <Typography sx={itemContentDisplay} variant="body1">{contentBody}</Typography>
            <ContentUnitEditorButtons contentID={contentUnit.contentID} onDelete={openDeleteWindow}
                                      requestedContentCategory={requestedContentCategory}/>
            <CommentSection requestedContentID={contentUnit.contentID}
                            requestedContentCategory={requestedContentCategory}></CommentSection>
        </Grid>);
}
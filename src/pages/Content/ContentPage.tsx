import React, {Fragment, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";
import parse from 'html-react-parser';

import "../../assets/HomePage.css";

import {ContentUnit, GetDummyContent} from "../../utils/Types/Content/ContentUnit";
import {ContentUnitContainer} from "../../utils/Types/Content/ContentUnitContainer";
import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";
import {GetContent} from "../../utils/ContentInteraction/GetContent";
import ImageGallery, {imageBoxStyle} from "../../components/ImageGallery/ImageGallery";
import EditDeleteButtons from "./EditDeleteButtons";
import DeleteContent from "../../utils/ContentInteraction/DeleteContent";
import {GoToHomePage} from "../../utils/GoToHomePage";
import DownloadLinksList from "../../components/DownloadLinks/DownloadLinksList";
import {CanUserEditContent} from "../../utils/Login";
import {CommentSection} from "../../components/Comments/CommentSection";

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

export default function ContentPage({contentNumber, contentCategory}: ContentUnitRequestData) {
    const [rawItemContent, setRawItemContent] = useState(GetDummyContent());

    useEffect(() => {
        if (rawItemContent.number == -1) {
            GetContent(contentNumber, contentCategory).then((conItem: ContentUnit) => setRawItemContent(conItem));
        }
    });

    if (rawItemContent.number != -1) {
        return (<LoadedContentPage itemContent={rawItemContent} contentCategory={contentCategory}/>);
    } else {
        return (<Fragment/>);
    }
}

function LoadedContentPage({itemContent, contentCategory}: ContentUnitContainer) {
    window.scrollTo(0, 0);

    const confirmDelete = () => {
        DeleteContent(itemContent.number, contentCategory).then(() => {
            GoToHomePage();
        });
    }
    const images = itemContent.gallery.map((link: string) => {
        return (
            <Grid key={link} sx={imageBoxStyle}>
                <img src={link}/>
            </Grid>)
    });
    const canEdit = CanUserEditContent();
    let content = parse(itemContent.content);
    return (
        <Grid sx={itemContentDisplay}>
            <Typography variant="h3">{itemContent.title}</Typography>
            {itemContent.categories != "" ?
                <Typography variant="subtitle2" color="grey">{itemContent.categories}</Typography> :
                <Fragment/>}
            <ImageGallery images={images}/>
            <DownloadLinksList links={itemContent.fileLinks}/>
            <Typography sx={itemContentDisplay} variant="body1">{content}</Typography>
            {canEdit ? <EditDeleteButtons contentNumber={itemContent.number} onDelete={confirmDelete}/> : <Fragment/>}
            <CommentSection contentNumber={itemContent.number} contentCategory={contentCategory}></CommentSection>
        </Grid>);
}
import React, {Fragment, useEffect, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import parse from 'html-react-parser';

import "../../assets/HomePage.css";

import {GetDummyContent} from "../../utils/Types/Content/ContentUnit";
import {ContentUnitContainer} from "../../utils/Types/Content/ContentUnitContainer";
import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";
import {GetContent} from "../../utils/ContentInteraction/GetContent";
import ImageGallery from "../../components/ImageGallery";
import EditDeleteButtons from "./EditDeleteButtons";
import DeleteContent from "../../utils/ContentInteraction/DeleteContent";
import {GoToHomePage} from "../../utils/GoToHomePage";

const itemBorderStyle = {
    width: '203px',
    height: '203px',
    border: '2px solid black'
}

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

export {itemBorderStyle}

export default function ContentPage({contentNumber, contentCategory}: ContentUnitRequestData) {
    const [rawItemContent, setRawItemContent] = useState(GetDummyContent());

    useEffect(() => {
        if (rawItemContent.number == -1) {
            GetContent(contentNumber, contentCategory).then((conItem) => {
                const fullLinks: string[] = conItem.GALLERY[0] != 'none' ? conItem.GALLERY.map((link: string) => "http://" + window.location.host + ":8000/" + link) : [];
                setRawItemContent({
                    number: conItem.NUMBER,
                    title: conItem.TITLE,
                    categories: conItem.CATEGORIES,
                    content: conItem.CONTENT,
                    creationDate: conItem.CREATION_DATE,
                    gallery: fullLinks
                });
            });
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

    let content = parse(itemContent.content);
    return (
        <Grid sx={itemContentDisplay}>
            <Typography variant="h4">{itemContent.title}</Typography>
            <Typography variant="subtitle2" color="grey">{itemContent.categories}</Typography>
            <ImageGallery imageLinks={itemContent.gallery}/>
            <Typography sx={itemContentDisplay} variant="body1">{content}</Typography>
            <EditDeleteButtons contentNumber={itemContent.number} onDelete={confirmDelete}/>
        </Grid>);
}
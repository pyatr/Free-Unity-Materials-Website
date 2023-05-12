import React, {Fragment, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import {GalleryFullView} from "./GalleryFullView";

export type ImageGalleryProps = {
    imageLinks: string[],
    imageMapper: Function
}

const imageGalleryGridStyle = {
    padding: "24px",
    gap: "24px",
    display: "flex",
    overflow: "scroll"
}

const imageGalleryBoxStyle = {
    border: "2px solid",
    borderColor: "black"
}

const imageBoxStyle = {
    border: "2px solid",
    borderColor: "black",
    width: "300px",
    height: "300px",
    maxWidth: "300px",
    maxHeight: "300px",
    minWidth: "300px",
    minHeight: "300px",
    boxSizing: "unset",
    display: "grid",
    cursor: "pointer"
}

export {imageBoxStyle}

export default function ImageGallery({imageLinks, imageMapper}: ImageGalleryProps) {
    const [fullViewImageLink, setFullImageView] = useState("");

    if (imageLinks.length == 0) {
        return <Fragment/>;
    }

    const showNextImage = () => {
        let currentImageIndex = imageLinks.indexOf(fullViewImageLink);
        if (currentImageIndex != -1) {
            currentImageIndex++;
            if (currentImageIndex >= imageLinks.length)
                currentImageIndex = 0;
            setFullImageView(imageLinks[currentImageIndex]);
        }
    }

    const showPreviousImage = () => {
        let currentImageIndex = imageLinks.indexOf(fullViewImageLink);
        if (currentImageIndex != -1) {
            currentImageIndex--;
            if (currentImageIndex < 0)
                currentImageIndex = imageLinks.length - 1;
            setFullImageView(imageLinks[currentImageIndex]);
        }
    }

    const openFullImageView = (newFullViewImageLink: string) => {
        const body = document.body;
        if (body != null) {
            body.style.overflow = "hidden";
            setFullImageView(newFullViewImageLink);
        }
    }

    const closeFullImageView = () => {
        const body = document.body;
        if (body != null) {
            body.style.overflow = "scroll";
            setFullImageView("");
        }
    }

    const mainBox = document.getElementById("mainElementBox");
    let newWidth = 1000;

    if (mainBox != null) {
        newWidth = (mainBox as HTMLElement).getBoundingClientRect().width - 48;
    }

    const mappedImages: JSX.Element[] = imageLinks.map((currentLink: string) => imageMapper(currentLink, () => openFullImageView(currentLink)));

    return (
        <Grid display="grid" marginTop="16px" marginBottom="16px">
            {fullViewImageLink != "" ?
                <GalleryFullView imageLink={fullViewImageLink}
                                 onBackgroundClick={closeFullImageView}
                                 onNextClick={showNextImage}
                                 onPreviousClick={showPreviousImage}/> :
                <Fragment/>}
            <Typography variant="h6">Gallery</Typography>
            <Box sx={[imageGalleryBoxStyle, {width: newWidth + "px"}]}>
                <Grid style={imageGalleryGridStyle}>
                    {mappedImages}
                </Grid>
            </Box>
        </Grid>);
}
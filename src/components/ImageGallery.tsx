import React, {Fragment} from "react";
import {Box, Grid} from "@mui/material";
import {GetImageFromURL} from "../utils/Files/GetImageFromURL";

export type ImageLinks = {
    imageLinks: string[]
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
    display: "grid"
}

export default function ImageGallery({imageLinks}: ImageLinks) {
    if (imageLinks.length == 0) {
        return <Fragment/>;
    }

    const mainBox = document.getElementById("mainElementBox");
    let newWidth = 1000;

    if (mainBox != null) {
        newWidth = (mainBox as HTMLElement).getBoundingClientRect().width - 48;
    }

    const images = imageLinks.map((link: string) => {
        return (
            <Grid sx={imageBoxStyle}>
                <img src={link}/>
            </Grid>)
    });

    return (
        <Box sx={[imageGalleryBoxStyle, {width: newWidth + "px"}]}>
            <Grid style={imageGalleryGridStyle}>
                {images}
            </Grid>
        </Box>);
}
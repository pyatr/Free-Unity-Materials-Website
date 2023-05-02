import React, {Fragment} from "react";
import {Box, Grid, Typography} from "@mui/material";

export type PreparedImages = {
    images: JSX.Element[]
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

export {imageBoxStyle}

export default function ImageGallery({images}: PreparedImages) {
    if (images.length == 0) {
        return <Fragment/>;
    }

    const mainBox = document.getElementById("mainElementBox");
    let newWidth = 1000;

    if (mainBox != null) {
        newWidth = (mainBox as HTMLElement).getBoundingClientRect().width - 48;
    }

    return (
        <Grid display="grid" marginTop="16px" marginBottom="16px">
            <Typography variant="h6">Gallery</Typography>
            <Box sx={[imageGalleryBoxStyle, {width: newWidth + "px"}]}>
                <Grid style={imageGalleryGridStyle}>
                    {images}
                </Grid>
            </Box>
        </Grid>);
}
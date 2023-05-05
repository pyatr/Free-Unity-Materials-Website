import React, {Fragment, useState} from "react";
import {Box, Grid} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {ImageInGallery} from "../../utils/Types/ImageInGallery";

const imageFrameStyle = {
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
    position: "relative"
}

const editButtonFrameStyle = {
    height: '40px',
    width: '40px',
    border: "2px solid",
    color: "black",
    background: "white",
    cursor: "pointer"
}

export function ImageInEditFormGallery({imageLink, onDeleteClick}: ImageInGallery) {
    const [isHovering, setHovering] = useState(false);
    return (
        <Grid sx={imageFrameStyle}
              onMouseEnter={() => {
                  setHovering(true);
              }}
              onMouseLeave={() => {
                  setHovering(false);
              }}>
            {isHovering ?
                <Grid sx={{position: "absolute", padding: "16px", display: "flex"}}>
                    <Box sx={editButtonFrameStyle}>
                        <Delete sx={{height: '36px', width: '36px'}} onClick={() => onDeleteClick()}/>
                    </Box>
                </Grid> :
                <Fragment/>
            }
            <img src={imageLink}/>
        </Grid>);
    //TODO: add full screen image display on image click
}
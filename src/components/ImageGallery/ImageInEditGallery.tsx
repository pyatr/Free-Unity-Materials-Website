import React, {Fragment, useState} from "react";
import {Box, Grid} from "@mui/material";
import {Delete} from "@mui/icons-material";

export type ImageInGallery = {
    imageLink: string,
    onClick: Function
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
    position: "relative"
}

export function ImageInEditGallery({imageLink, onClick}: ImageInGallery) {
    const [isHovering, setHovering] = useState(false);
    return (
        <Grid sx={imageBoxStyle}
              onMouseEnter={() => {
                  setHovering(true);
              }}
              onMouseLeave={() => {
                  setHovering(false);
              }}>

            {isHovering ?
                <Grid sx={{position: "absolute", padding: "16px", display: "flex"}}>
                    <Box sx={{
                        height: '40px',
                        width: '40px',
                        border: "2px solid",
                        color: "black",
                        background: "white",
                        cursor: "pointer"
                    }}>
                        <Delete sx={{height: '36px', width: '36px'}} onClick={() => {
                            onClick();
                        }}/>
                    </Box>
                </Grid> :
                <Fragment/>
            }
            <img src={imageLink}/>
        </Grid>);
}
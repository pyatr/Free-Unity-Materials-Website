import React, {Fragment, useEffect, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import ServerConnection from "../../utils/ServerConnection";
import {AxiosResponse} from "axios";
import {ContentItem} from "../../utils/ContentItem";
import parse from 'html-react-parser';
import TextField from "@mui/material/TextField";
import "../../assets/HomePage.css";

export type ItemContent = {
    itemContent: ContentItem | null
}

const itemBorderStyle = {
    width: "203px",
    height: "203px",
    border: "2px solid black"
}

const itemContentDisplay = {
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    display: 'grid'
}

export default function ItemEditPage({itemContent}: ItemContent) {
    const gridStyle = {
        display: "grid",
        gap: "8px"
    }
    if (itemContent == null) {
        itemContent = {
            NUMBER: -1,
            TITLE: "No title",
            SHORTTITLE: "No short title",
            CATEGORIES: "none",
            CREATION_DATE: "generated",
            CONTENT: ""
        };
    }

    window.scrollTo(0, 0);
    let content = itemContent.CONTENT;
    return (
        <Grid style={gridStyle}>
            <Box style={itemBorderStyle}>
                {<img width="200px" height="200px"
                      src={"http://" + window.location.host + ":8000/TitlePics/" + itemContent.NUMBER + ".png"}/>}
            </Box>
            <TextField>{itemContent.TITLE}</TextField>
            <TextField>{itemContent.SHORTTITLE}</TextField>
            <TextField>{itemContent.CATEGORIES}</TextField>
            <TextField sx={itemContentDisplay}>{content}</TextField>
        </Grid>);

}
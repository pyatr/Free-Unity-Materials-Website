import React, {Fragment, useEffect, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import parse from 'html-react-parser';

import "../../assets/HomePage.css";

import {ContentItem,  GetDummyContent} from "../../utils/Types/ContentItem";
import {ContentItemContainer} from "../../utils/Types/ContentItemContainer";
import {ItemPage} from "../../utils/Types/ItemPage";
import {GetItem} from "../../utils/GetItem";

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

export default function ItemPage({itemNumber, itemCategory}: ItemPage) {
    const [rawItemContent, setRawItemContent] = useState(GetDummyContent());

    useEffect(() => {
        if (rawItemContent.NUMBER == -1) {
            GetItem(itemNumber).then((conItem: ContentItem) => {
                setRawItemContent(conItem);
            });
        }
    });

    if (rawItemContent.NUMBER != -1) {
        return (<LoadedItemPage itemContent={rawItemContent} contentCategory={itemCategory}/>);
    } else {
        return (<Fragment/>);
    }
}

function LoadedItemPage({itemContent, contentCategory}: ContentItemContainer) {
    window.scrollTo(0, 0);
    let content = parse(itemContent.CONTENT);
    return (
        <Grid sx={itemContentDisplay}>
            <Box style={itemBorderStyle}>
                {<img width="200px" height="200px"
                      src={"http://" + window.location.host + ":8000/TitlePics/" + itemContent.NUMBER + ".png"}/>}
            </Box>
            <Typography variant="h4">{itemContent.TITLE}</Typography>
            <Typography variant="subtitle2" color="grey">{itemContent.CATEGORIES}</Typography>
            <Typography sx={itemContentDisplay} variant="body1">{content}</Typography>
        </Grid>);
}
import React, {Fragment, useEffect, useState} from "react";
import {Box, Grid, Typography} from "@mui/material";
import ServerConnection from "../../utils/ServerConnection";
import {AxiosResponse} from "axios";
import {ContentItem} from "../../utils/ContentItem";
import parse from 'html-react-parser';
import "../../assets/HomePage.css";

export type ItemPage = {
    itemNumber: number
}

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

export default function ItemPage({itemNumber}: ItemPage) {
    const [rawItemContent, setRawItemContent] = useState(Array<ContentItem>);

    useEffect(() => {
        const waitForItemContent = async () => {
            if (rawItemContent.length > 0 || itemNumber < 1) {
                return;
            }
            let scon = new ServerConnection();
            let params = {
                number: itemNumber
            };
            await scon.SendPostRequest("getContent", params,
                (response: AxiosResponse) => {
                    //Use response.data.code for SQL request code and response.data.requesterror for error details
                    if (response.data.result === "success") {
                        setRawItemContent(response.data.content);
                    } else {
                        console.log("request failed: " + response.data.code + "\nError: " + response.data.requesterror);
                    }
                });
        }
        waitForItemContent();
    });

    if (rawItemContent.length > 0) {
        window.scrollTo(0, 0);
        let content = parse(rawItemContent[0].CONTENT);
        return (
            <Grid sx={itemContentDisplay}>
                <Box style={itemBorderStyle}>
                    {<img width="200px" height="200px"
                          src={"http://" + window.location.host + ":8000/TitlePics/" + itemNumber + ".png"}/>}
                </Box>
                <Typography variant="h4">{rawItemContent[0].TITLE}</Typography>
                <Typography variant="subtitle2" color="grey">{rawItemContent[0].CATEGORIES}</Typography>
                <Typography sx={itemContentDisplay} variant="body1">{content}</Typography>
            </Grid>);
    } else {
        return (<Fragment/>);
    }
}
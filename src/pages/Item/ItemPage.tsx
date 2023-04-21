import {Fragment, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";
import ServerConnection from "../../utils/ServerConnection";
import {AxiosResponse} from "axios";
import {ContentItem} from "../../utils/ContentItem";
import parse from 'html-react-parser';

export type ItemNumber = {
    itemNumber: number
}

export type ItemPage = {
    rawContent: ContentItem
}

export default function ItemPage({itemNumber}: ItemNumber) {
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
            await scon.sendPostRequest("getContent", params,
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

    const gridStyle = {
        display: "grid"
    }
    if (rawItemContent.length > 0) {
        window.scrollTo(0, 0);
        let content = parse(rawItemContent[0].CONTENT.replace('\n', '<br/>'));
        return (
            <Grid style={gridStyle}>
                <Typography variant="h4">{rawItemContent[0].TITLE}</Typography>
                <Typography variant="subtitle2" color="grey">{rawItemContent[0].CATEGORIES}</Typography>
                <Typography sx={{wordBreak: "break-word"}} variant="body1">{content}</Typography>
            </Grid>);
    } else {
        return (<Fragment/>);
    }
}
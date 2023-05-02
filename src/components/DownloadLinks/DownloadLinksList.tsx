import React, {Fragment, useState} from "react";
import {Grid, Typography} from "@mui/material";
import {GetLastURLPart} from "../../utils/GetLastURLPart";

type LinksList = {
    links: string[]
}

type DownloadLinkProp = {
    link: string
}

function DownloadLink({link}: DownloadLinkProp) {
    const fileName = GetLastURLPart(link);

    const downloadFile = async () => {
        fetch(link).then((response) => {
            response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                a.click();
            });
        });
    }
    return (
        <Typography style={{
            color: "blue",
            textDecorationLine: "underline",
            textUnderlineOffset: "4px",
            cursor: "pointer",
            width: "fit-content"
        }} onClick={downloadFile}>{fileName}</Typography>);
}

export default function DownloadLinksList({links}: LinksList) {
    if (links.length == 0) {
        return (<Fragment/>);
    }

    const preparedLinks = links.map((link: string) => <DownloadLink link={link}/>);

    return (
        <Grid display="grid" marginTop="16px" marginBottom="16px">
            <Typography variant="h6">Attached files</Typography>
            <Grid sx={{
                display: "grid",
                border: "2px solid",
                borderColor: "black",
                borderRadius: "2px",
                gap: "8px",
                padding: "8px"
            }}>
                {preparedLinks}
            </Grid>
        </Grid>);
}
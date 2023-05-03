import React, {Fragment, useState} from "react";
import {Grid, Typography} from "@mui/material";
import {CheckBox, Delete} from "@mui/icons-material";
import {GetLastURLPart} from "../../utils/GetLastURLPart";
import {FileNameBlobPair, GetBlobsFromPairs, GetFileNamesFromPairs} from "../../utils/Types/FileNameBlobPair";

type FileListEditButtons = {
    links: string[],
    newFiles: FileNameBlobPair[],
    onDeletionMarked: Function
}

type DownloadLinkEditProp = {
    fileName: string,
    link: string,
    isNew: boolean,
    onDeletionMarked: Function
}

function DownloadLinkEdit({fileName, link, onDeletionMarked, isNew}: DownloadLinkEditProp) {
    const [isMarkedForDeletion, setDeletionStatus] = useState(false);
    const textStyleMarked = {
        color: isNew ? "blue" : "red",
        textDecoration: "line-through",
        textDecorationThickness: "2px"
    }
    const textStyleUnmarked = {
        color: isNew ? "blue" : "inherit",
    }

    return (
        <Grid display="flex" columnGap="8px">
            {isMarkedForDeletion ?
                <CheckBox style={{cursor: "pointer"}} onClick={() => {
                    onDeletionMarked(link);
                    setDeletionStatus(false)
                }}/> :
                <Delete style={{cursor: "pointer"}} onClick={() => {
                    onDeletionMarked(link);
                    setDeletionStatus(true);
                }}/>}
            <Typography style={isMarkedForDeletion ? textStyleMarked : textStyleUnmarked}>{fileName}</Typography>
        </Grid>);
}

export default function DownloadLinksEditList({links, newFiles, onDeletionMarked}: FileListEditButtons) {
    if (links.length == 0 && newFiles.length == 0) {
        return (<Fragment/>);
    }
    const newFileBlobs = GetBlobsFromPairs(newFiles);

    links = links.concat(newFileBlobs);
    const preparedLinks = links.map((link: string) => {
        const isNew = newFileBlobs.includes(link);
        let fileName = isNew ? newFiles.filter(pair => pair.blobLink == link)[0].fileName : GetLastURLPart(link);
        return (<DownloadLinkEdit
            key={fileName}
            fileName={fileName}
            link={link}
            isNew={isNew}
            onDeletionMarked={onDeletionMarked}
        />);
    });


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
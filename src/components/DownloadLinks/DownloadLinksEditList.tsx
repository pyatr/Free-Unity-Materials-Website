import React, {Fragment, useState} from "react";
import {Grid, Typography} from "@mui/material";
import {CheckBox, Delete} from "@mui/icons-material";
import {GetLastURLPart} from "../../utils/GetLastURLPart";

type FileListEditButtons = {
    links: string[],
    newFiles: string[],
    onDeletionMarked: Function
}

type DownloadLinkEditProp = {
    link: string,
    isNew: boolean,
    onDeletionMarked: Function
}

function DownloadLinkEdit({link, onDeletionMarked, isNew}: DownloadLinkEditProp) {
    const fileName = GetLastURLPart(link);
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

export default function DownloadLinksEditList({links, onDeletionMarked, newFiles}: FileListEditButtons) {
    if (links.length == 0) {
        return (<Fragment/>);
    }

    const preparedLinks = links.map((link: string) => <DownloadLinkEdit link={link}
                                                                        isNew={newFiles.includes(link)}
                                                                        onDeletionMarked={onDeletionMarked}/>);

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
import React, {Fragment, useState} from "react";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {IsUserAdmin, GetUserEmail} from "../../utils/Login";
import {AccountBox, Cancel, CheckCircle} from "@mui/icons-material";
import MessageBoxYesNo from "../MessageBoxes/MessageBoxYesNo";

const editButtonStyle = {
    color: "gray",
    textDecorationLine: "underline",
    textUnderlineOffset: "6px",
    fontSize: "0.8rem",
    padding: "0px"
}

type UserCommentDisplayProps = {
    userEmail: string,
    userName: string,
    content: string,
    creationDate: string,
    commentID: number,
    onEdit: Function,
    onDelete: Function
}

export function UserComment({
                                userEmail,
                                userName,
                                content,
                                creationDate,
                                commentID,
                                onEdit,
                                onDelete
                            }: UserCommentDisplayProps) {

    const [userComment, setUserComment] = useState(content);
    const [inEditMode, setEditMode] = useState(false);
    const [deleteWindowOpen, setDeleteWindow] = useState(false);

    const confirmDelete = () => {
        setDeleteWindow(false);
        onDelete(commentID);
    }
    const cancelDelete = () => setDeleteWindow(false);

    const canEditOrDelete = (GetUserEmail() == userEmail || IsUserAdmin());

    const onCommentInputChange = (event: any) => {
        setUserComment(event.target.value);
    }

    if (userName === "") {
        userName = "Deleted user";
    }

    return (
        <Fragment>
            <Grid border="1px solid" gap="8px" borderColor="gray" padding="6px" display="flex"
                  justifyContent="space-between">
                <Grid display="grid" gap={inEditMode ? "12px" : "4px"} height="fit-content" width="100%">
                    <Typography fontWeight="bold">{userName}</Typography>
                    {inEditMode ?
                        <TextField onChange={onCommentInputChange}
                                   label={"Edit comment"}
                                   value={userComment}
                                   multiline={true}
                                   InputProps={{sx: {width: "100%"}}}/> :
                        <Typography>{content}</Typography>}
                </Grid>
                {canEditOrDelete && !inEditMode ?
                    <Grid display="grid" gap="6px" height="fit-content" marginTop="4px" marginBottom="4px">
                        {deleteWindowOpen ?
                            <MessageBoxYesNo message={"Delete comment?"}
                                             onConfirm={confirmDelete}
                                             onCancel={cancelDelete}
                                             parentWidth={"320px"}
                                             parentHeight={"256px"}/> :
                            <Fragment/>}
                        <Button style={editButtonStyle}
                                onClick={() => setDeleteWindow(true)}>delete</Button>
                        <Button style={editButtonStyle}
                                onClick={() => setEditMode(true)}>edit</Button>
                    </Grid> :
                    <Fragment/>}
            </Grid>
            {
                inEditMode ?
                    <Grid margin="8px" display="flex" justifyContent="space-between">
                        <Button style={editButtonStyle}
                                onClick={() => {
                                    onEdit(commentID, userComment);
                                    setEditMode(false);
                                }}>Save</Button>
                        <Button style={editButtonStyle} onClick={() => {
                            setUserComment(content);
                            setEditMode(false);
                        }}>Cancel</Button>
                    </Grid> :
                    <Fragment/>
            }
        </Fragment>
    )
        ;
}

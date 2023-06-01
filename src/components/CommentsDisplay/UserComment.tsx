import React, {Fragment, useState} from "react";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {IsUserAdmin, GetUserEmail} from "../../utils/User/Login";
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
    userAvatarURL: string,
    content: string,
    creationDate: string,
    commentID: number,
    onEdit: Function,
    onDelete: Function
}

const editButtonsGrid = {
    display: "grid",
    gap: "6px",
    justifyContent: "end",
    height: "fit-content",
    marginTop: "4px",
    marginBottom: "4px"
}

const mainCommentGrid = {
    border: "1px",
    borderStyle: "solid",
    borderColor: "gray",
    gap: "8px",
    padding: "6px",
    display: "flex",
    justifyContent: "space-between"
}

export function UserComment({
                                userEmail,
                                userName,
                                userAvatarURL,
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

    const onCancelEditing = () => {
        setUserComment(content);
        setEditMode(false);
    }

    const onSaveComment = () => {
        onEdit(commentID, userComment);
        setEditMode(false);
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
            <Grid sx={mainCommentGrid}>
                {userAvatarURL !== "" ?
                    <Box style={{
                        border: "2px",
                        borderStyle: "solid",
                        margin: "0.5em",
                        width: "3.2em",
                        height: "3.2em",
                        display: "grid",
                        overflow: "hidden",
                        justifyContent: "center"
                    }}>
                        <img style={{height: "inherit", maxWidth: "none", maxHeight: "none"}}
                             src={userAvatarURL}/>
                    </Box> :
                    <AccountBox style={{width: "3.7rem", height: "3.7rem", color: "black"}}/>}
                <Grid display="grid" gap={inEditMode ? "12px" : "4px"} height="fit-content" width="100%">
                    <Typography fontWeight="bold" marginTop="0.3rem">{userName}</Typography>
                    {inEditMode ?
                        <TextField onChange={onCommentInputChange}
                                   label={"Edit comment"}
                                   value={userComment}
                                   multiline={true}
                                   InputProps={{sx: {width: "100%"}}}/> :
                        <Typography>{content}</Typography>}
                </Grid>
                {canEditOrDelete && !inEditMode ?
                    <Grid sx={editButtonsGrid}>
                        {deleteWindowOpen ?
                            <MessageBoxYesNo message={"Delete comment?"}
                                             onConfirm={confirmDelete}
                                             onCancel={cancelDelete}
                                             parentWidth={"320px"}
                                             parentHeight={"256px"}/> :
                            <Fragment/>}
                        <Button style={editButtonStyle} onClick={() => setDeleteWindow(true)}>
                            delete
                        </Button>
                        <Button style={editButtonStyle} onClick={() => setEditMode(true)}>
                            edit
                        </Button>
                    </Grid> :
                    <Fragment/>}
            </Grid>
            {inEditMode ?
                <Grid margin="8px" display="flex" justifyContent="space-between">
                    <Button style={editButtonStyle} onClick={onSaveComment}>
                        Save
                    </Button>
                    <Button style={editButtonStyle} onClick={onCancelEditing}>
                        Cancel
                    </Button>
                </Grid> :
                <Fragment/>}
        </Fragment>);
}

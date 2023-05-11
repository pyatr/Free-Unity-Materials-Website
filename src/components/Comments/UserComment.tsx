import React, {Fragment} from "react";
import {Box, Button, Grid, Typography} from "@mui/material";
import {IsUserAdmin, GetUserEmail} from "../../utils/Login";

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
    const canEditOrDelete = (GetUserEmail() == userEmail || IsUserAdmin());
    return (
        <Grid border="1px solid" borderColor="gray" padding="6px" display="flex"
              justifyContent="space-between">
            <Grid display="grid" gap="4px" height="fit-content">
                <Typography fontWeight="bold">{userName}</Typography>
                <Typography>{content}</Typography>
            </Grid>
            {canEditOrDelete ?
                <Grid display="grid" gap="6px" height="fit-content" marginTop="4px" marginBottom="4px">
                    <Button style={editButtonStyle}
                            onClick={() => onDelete(commentID)}>delete</Button>
                    <Button style={editButtonStyle}
                            onClick={() => onEdit(commentID)}>edit</Button>
                </Grid> :
                <Fragment/>}
        </Grid>);
}
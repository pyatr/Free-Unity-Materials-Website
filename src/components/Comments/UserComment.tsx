import React from "react";
import {Box, Typography} from "@mui/material";
import {UserCommentProps} from "../../utils/Types/UserCommentProps";

export function UserComment({userEmail, userName, content, creationDate}: UserCommentProps) {
    return (
        <Box border="1px solid" borderColor="gray" padding="1px">
            <Typography>{userName} says: {content}</Typography>
        </Box>);
}
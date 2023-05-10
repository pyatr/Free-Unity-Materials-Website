import {Button, Grid, Typography} from "@mui/material";
import {ErrorRounded} from "@mui/icons-material";
import React, {Fragment} from "react";
import {ErrorNotificationProps} from "../utils/Types/ErrorNotificationProps";

export default function ErrorNotification({message, onDismiss}: ErrorNotificationProps) {
    if (message == "") {
        return (<Fragment/>);
    }
    return (
        <Grid style={{
            display: "flex",
            gap: "16px",
            color: "red",
            border: "2px",
            borderStyle: "solid",
            borderRadius: "4px",
            padding: "16px",
            marginTop: "16px",
            marginBottom: "16px",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <Grid style={{display: "flex", gap: "16px"}}>
                <ErrorRounded style={{height: "inherit"}}/>
                <Typography textAlign="center">
                    <pre style={{textAlign: "left"}}>{message}</pre>
                </Typography>
            </Grid>
            <Button onClick={() => onDismiss()} style={{color: "red"}}>Dismiss</Button>
        </Grid>);
}
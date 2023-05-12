import {Button, Grid} from "@mui/material";
import React, {Fragment} from "react";

import {sideButtonStyle} from "../../components/MainPage/MainContent";

type ContentFormInteractionProps = {
    onSave: Function,
    onCancel: Function,
    onDelete: Function,
    enableDelete: boolean
}

export default function ContentEditFormInteractionButtons({onSave, onCancel, onDelete, enableDelete}: ContentFormInteractionProps) {
    return (
        <Grid
            style={{display: "flex", gap: "16px", width: "100%", justifyContent: "space-between"}}>
            {/*Left grid*/}
            <Grid style={{display: "flex", gap: "16px"}}>
                {/*Using ()=> to ensure it's not called when bound*/}
                <Button onClick={() => onSave()} style={sideButtonStyle}>Save</Button>
                <Button onClick={() => onCancel()} style={sideButtonStyle}>Cancel</Button>
            </Grid>
            {/*Right grid*/}
            {enableDelete ?
                <Grid style={{display: "flex", gap: "16px"}}>
                    <Button onClick={() => onDelete()} style={sideButtonStyle}>Delete</Button>
                </Grid> :
                <Fragment/>}
        </Grid>
    );
}
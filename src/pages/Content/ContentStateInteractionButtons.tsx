import {Button, Grid} from "@mui/material";
import {sideButtonStyle} from "../../components/MainPage/MainContent";
import React, {Fragment} from "react";

export type ItemInteractionProps = {
    onSave: Function,
    onCancel: Function,
    onDelete: Function,
    enableDelete: boolean
}

export default function ContentStateInteractionButtons({onSave, onCancel, onDelete, enableDelete}: ItemInteractionProps) {
    return (
        <Grid style={{display: "flex", gap: "16px", width: "100%", justifyContent: "space-between"}}>
            {/*Left grid*/}
            <Grid style={{display: "flex", gap: "16px"}}>
                {/*Using ()=> to ensure its not called when bound*/}
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
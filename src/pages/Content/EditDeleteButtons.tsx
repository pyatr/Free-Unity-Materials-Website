import {Button, Grid} from "@mui/material";
import {sideButtonStyle} from "../../components/MainContent";
import React from "react";
import {Link} from "react-router-dom";

export type EditDeleteButtonsProps = {
    contentNumber: number
    onDelete: Function
}

export default function EditDeleteButtons({contentNumber, onDelete}: EditDeleteButtonsProps) {
    return (
        <Grid
            style={{display: "flex", paddingTop: "16px", gap: "16px", width: "100%", justifyContent: "space-between"}}>
            {/*Left grid*/}
            <Grid style={{display: "flex", gap: "16px"}}>
                <Button component={Link} to={"/edit/" + contentNumber} style={sideButtonStyle}>Edit</Button>
            </Grid>
            {/*Right grid*/}
            <Grid style={{display: "flex", gap: "16px"}}>
                <Button onClick={() => onDelete()} style={sideButtonStyle}>Delete</Button>
            </Grid>
        </Grid>);
}
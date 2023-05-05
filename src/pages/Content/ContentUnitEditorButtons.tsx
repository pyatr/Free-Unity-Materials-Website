import {Button, Grid} from "@mui/material";
import React, {Fragment} from "react";
import {Link} from "react-router-dom";

import {sideButtonStyle} from "../../components/MainPage/MainContent";
import {CanUserEditContent} from "../../utils/Login";

type ContentEditButtonsProps = {
    contentID: number
    onDelete: Function
}

const mainGridStyle = {
    display: "flex",
    paddingTop: "16px",
    gap: "16px",
    width: "100%",
    justifyContent: "space-between"
}

export default function ContentUnitEditorButtons({contentID, onDelete}: ContentEditButtonsProps) {
    if (CanUserEditContent()) {
        return (
            <Grid style={mainGridStyle}>
                {/*Left grid*/}
                <Grid style={{display: "flex", gap: "16px"}}>
                    <Button component={Link} to={"/edit/" + contentID} style={sideButtonStyle}>Edit</Button>
                </Grid>
                {/*Right grid*/}
                <Grid style={{display: "flex", gap: "16px"}}>
                    <Button onClick={() => onDelete()} style={sideButtonStyle}>Delete</Button>
                </Grid>
            </Grid>);
    } else {
        return <Fragment/>;
    }
}
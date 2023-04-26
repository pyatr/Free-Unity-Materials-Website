import {Box, Grid, Typography} from "@mui/material";
import React, {ChangeEventHandler, Fragment} from "react";

export type ItemPreviewSelection = {
    loadImageFunction: ChangeEventHandler
}

export default function ContentEditLoadImages({loadImageFunction}: ItemPreviewSelection) {
    return (
        <Fragment>
            <Grid
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px",
                    width: "fit-content",
                    height: "24px",
                    maxHeight: "24px"
                }}>
                <Typography variant="subtitle2">Add images to gallery</Typography>
                {<input onChange={loadImageFunction} multiple={true} type="file"/>}
            </Grid>
        </Fragment>);
}
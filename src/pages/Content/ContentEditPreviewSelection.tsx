import {Box, Grid, Typography} from "@mui/material";
import React, {ChangeEventHandler, Fragment} from "react";
import {itemBorderStyle} from "./ContentPage";

export type ItemPreviewSelection = {
    previewImage: string,
    loadImageFunction: ChangeEventHandler
}

export default function ContentEditPreviewSelection({previewImage, loadImageFunction}: ItemPreviewSelection) {
    return (
        <Fragment>
            <Box style={itemBorderStyle}>
                {<img width="200px" height="200px" src={previewImage}/>}
            </Box>
            <Grid
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px",
                    width: "fit-content",
                    height: "24px",
                    maxHeight: "24px"
                }}>
                <Typography variant="subtitle2">Set preview image</Typography>
                {<input onChange={loadImageFunction} type="file"/>}
            </Grid>
        </Fragment>);
}
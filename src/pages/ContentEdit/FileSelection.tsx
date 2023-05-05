import {Grid, Typography} from "@mui/material";
import React, {Fragment} from "react";
import {FileSelectionInfo} from "../../utils/Types/FileSelectionInfo";

export default function FileSelection({title, inputType, multiple, loadImageFunction}: FileSelectionInfo) {
    return (
        <Fragment>
            <Grid style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                width: "fit-content",
                height: "24px",
                maxHeight: "24px"
            }}>
                <Typography variant="subtitle2">{title}</Typography>
                {<input type={inputType} multiple={multiple} onChange={loadImageFunction}/>}
            </Grid>
        </Fragment>);
}
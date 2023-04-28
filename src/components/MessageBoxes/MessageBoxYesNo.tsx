import {Box, Grid, Typography} from "@mui/material";
import PixelSummForCSS from "../../utils/PixelSummForCSS";
import {Cancel, CheckCircle} from "@mui/icons-material";
import React from "react";
import {MessageBoxYesNoProps} from "../../utils/Types/MessageBoxes/MessageBoxYesNoProps";

const messageBoxButtonsStyle = {
    width: '40px',
    height: '40px'
}

export default function MessageBoxYesNo({message, onConfirm, onCancel, parentWidth, parentHeight}: MessageBoxYesNoProps) {
    return (<Box padding='8px'
                 position='absolute'
                 zIndex='11'
                 width={PixelSummForCSS(parentWidth, "-16px")}
                 height={PixelSummForCSS(parentHeight, "-16px")}>
        <Box style={{border: '2px', borderStyle: 'solid', background: 'white'}}>
            <Grid style={{display: 'grid', padding: '16px', gap: '32px'}}>
                <Typography variant="h5" sx={{textOverflow: "ellipsis", overflow: "hidden"}}>{message}</Typography>
                <Grid style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <CheckCircle style={messageBoxButtonsStyle} onClick={() => onConfirm()}/>
                    <Cancel style={messageBoxButtonsStyle} onClick={() => onCancel()}/>
                </Grid>
            </Grid>
        </Box>
    </Box>);
}
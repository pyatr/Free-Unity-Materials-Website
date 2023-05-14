import React from "react";
import Box from "@mui/material/Box";
import "../assets/LoadingAnimation.css";
import {RotateRight} from "@mui/icons-material";

const overlayStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}

export function LoadingOverlay() {
    return (
        <Box style={overlayStyle}>
            <RotateRight style={{width: "4em", height: "4em"}} className="rotate"/>
        </Box>
    );
}
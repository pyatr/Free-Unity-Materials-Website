import React from "react";
import Box from "@mui/material/Box";
import "../assets/LoadingAnimation.css";
import {ChangeCircle} from "@mui/icons-material";

type LoadingOverlayProps = {
    position: string
}

const overlayStyle = {
    width: "100%",
    height: "80%",
    minHeight: "12em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.8)"
}

export function LoadingOverlay({position}: LoadingOverlayProps) {
    return (
        <Box sx={[overlayStyle, {position: position}]}>
            <ChangeCircle style={{width: "4em", height: "4em"}} className="rotate"/>
        </Box>
    );
}
import React from "react";
import Box from "@mui/material/Box";
import "../assets/LoadingAnimation.css";
import {ChangeCircle} from "@mui/icons-material";

type LoadingOverlayProps = {
    position: string
}

const overlayStyle = {
    width: "100%",
    height: "70%",
    minHeight: "20em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.8)",
    zIndex: 22
}

export function LoadingOverlay({position}: LoadingOverlayProps) {
    return (
        <Box sx={[overlayStyle, {position: position}]}>
            <ChangeCircle style={{width: "4em", height: "4em", zIndex: 23}} className="rotate"/>
        </Box>
    );
}
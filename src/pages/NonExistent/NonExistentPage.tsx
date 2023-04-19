import {Typography} from "@mui/material";
import React from "react";
import {PageLoadProps} from "../../utils/PageData/PageData";

export default function NonExistentPage({onPageLoaded}: PageLoadProps) {
    return (
        <Typography variant="h4">404</Typography>
    );
}
import React, {Fragment, useEffect, useState} from "react";
import CategoryMenu from "./CategoryMenu";
import {Box, Grid} from "@mui/material";
import {ContentProps} from "../pages/Home/App";
import {IsMobileResolution} from "../utils/MobileUtilities";
import ContentPageSwitch from "./ContentPageSwitch";

export default function MainContent({mainElement}: ContentProps) {
    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight]);

    const updateWidthAndHeight = () => {
        setWidthHeight([window.innerWidth, window.innerHeight]);
    };

    useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });
    const landHeight = "65vh";
    const mobileHeight = "90vh";
    let realHeight = IsMobileResolution() ? mobileHeight : landHeight;
    var style = {
        p: 2,
        //71+12+12+1.5+1.5+1+1 = 100%
        minHeight: realHeight,
        width: "71%",
        height: "100%",
        border: 2,
        borderColor: 'primary.main',
        m: '0.5%',
        borderRadius: 1,
        justifySelf: "stretch",
        alignSelf: "stretch",
    }
    return (
        <Fragment>
            <CategoryMenu/>
            <Box sx={style} id="mainElementBox">
                {mainElement}
            </Box>
            <ContentPageSwitch/>
        </Fragment>);
}
import React, {Fragment, useEffect, useState} from "react";
import CategoryMenu from "./CategoryMenu";
import {Box} from "@mui/material";
import {ContentProps} from "../pages/Home/App";

export default function MainContent({mainElement}: ContentProps) {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const updateWidthAndHeight = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });
    var style = {
        p: 2,
        //71+12+12+1.5+1.5+1+1 = 100%
        width: "71%",
        height: '65vh',
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
        </Fragment>);
}
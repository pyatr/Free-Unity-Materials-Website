import React from "react";

import {Link} from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    Avatar,
    CssBaseline,
    Grid
} from "@mui/material";
import UserBarDisplay from "./UserBarDisplay";
import {SearchField} from "./SearchField";

const toolbarStyle = {
    margin: "0.5rem",
    justifyContent: "space-between"
}

const leftGridStyle = {
    display: "flex",
    gap: "1rem"
}

const avatarStyle = {
    width: "30%",
    height: "100%"
}

export default function SiteAppBar() {
    return (
        <AppBar position="static" color="default">
            <CssBaseline/>
            <Toolbar sx={toolbarStyle}>
                <Grid sx={leftGridStyle}>
                    <Avatar src="/assets/logo.png"
                            alt="logo"
                            component={Link}
                            to="/"
                            sx={avatarStyle}/>
                    <SearchField/>
                </Grid>
                <Box>
                    <UserBarDisplay/>
                </Box>
            </Toolbar>
        </AppBar>);
}
import React from "react";

import {Link} from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    Avatar,
    CssBaseline
} from "@mui/material";
import UserBarDisplay from "./UserBarDisplay";

export default function SiteAppBar() {
    return (
        <AppBar position="static" color="default">
            <CssBaseline/>
            <Toolbar sx={{margin: "0.5rem", justifyContent: "space-between"}}>
                <Avatar src="/assets/logo.png"
                        alt="logo"
                        component={Link}
                        to="/"
                        sx={{
                            width: "20%",
                            height: "100%"
                        }}/>
                <UserBarDisplay/>
            </Toolbar>
        </AppBar>);
}
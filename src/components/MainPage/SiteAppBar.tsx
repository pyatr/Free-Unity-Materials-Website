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
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" color="default">
                <CssBaseline/>
                <Toolbar sx={{justifyContent: "space-between"}}>
                    <Avatar
                        variant="square"
                        src="./assets/logo.png"
                        alt="logo"
                        component={Link}
                        to="/"
                        sx={{
                            width: "20%",
                            height: "100%",
                            margin: "0.5%"
                        }}/>
                    <UserBarDisplay/>
                </Toolbar>
            </AppBar>
        </Box>);
}
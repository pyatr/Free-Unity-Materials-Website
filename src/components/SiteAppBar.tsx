import React, {useState} from "react";

import {Link} from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    Avatar,
    CssBaseline,
    Typography,
    Grid
} from "@mui/material";

function AuthorizationLinksDisplay() {
    return (<Grid
        container
        direction="column"
        justifyContent="flex-end"
        alignItems="left"
        //TODO: разобраться откуда берутся -16px
        marginTop="0px"
        marginLeft="0px"
        spacing={2}
        sx={{
            width: "20%"
        }}>
        <Link style={{fontSize: 18}} to="/login">Log in</Link>
        <Link style={{fontSize: 18}} to="/register">Register</Link>
    </Grid>);
}

function UserDisplay() {
    return (<Typography>Logged in, congrats</Typography>);
}

function GetAuthorizationResult() {
    let isLoggedIn = (localStorage.getItem("userLoginStatus") === "true");
    if (isLoggedIn)
        return (<UserDisplay/>);
    else
        return (<AuthorizationLinksDisplay/>);
}

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
                    <GetAuthorizationResult/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
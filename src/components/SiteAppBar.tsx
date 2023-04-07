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
import Cookies from "universal-cookie";

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
        <Link style={{fontSize: 18, color: "#000000"}} to="/login">Log in</Link>
        <Link style={{fontSize: 18, color: "#000000"}} to="/register">Register</Link>
    </Grid>);
}

function UserDisplay() {
    return (
        <Grid
            container
            direction="column"
            justifyContent="flex-end"
            alignItems="left"
            marginTop="0px"
            marginLeft="0px"
            spacing={2}
            sx={{
                width: "20%"
            }}>
            <Typography style={{fontSize: 18}}>You are logged in</Typography>
            <Link style={{fontSize: 18, color: "#000000"}} to="/assets" onClick={LogOut}>Log out</Link>
        </Grid>);
}

function LogOut() {
    localStorage.removeItem("userLoginStatus");
    const cookies = new Cookies();
    cookies.remove("userLogin");
    window.location.reload();
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
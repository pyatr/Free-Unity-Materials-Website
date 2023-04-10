import React, {Fragment, useEffect, useState} from "react";

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
import {ClearUserData, TryCookieLogin} from "../utils/Login";

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
    const userName = sessionStorage.getItem("userName");

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
            <Typography style={{fontSize: 18, color: "#000000"}}>You are logged in as {userName}</Typography>
            <Link style={{fontSize: 18, color: "#000000"}} to="/assets" onClick={LogOut}>Log out</Link>
        </Grid>);
}

function LogOut() {
    ClearUserData();
    window.location.reload();
}

function GetAuthorizationResult() {
    const [isLoading, setLoadingStatus] = useState(true);

    useEffect(() => {
        TryCookieLogin().then(() => {
                const timer = setTimeout(() => {
                    setLoadingStatus(false);
                }, 300);
                return () => clearTimeout(timer);
            }
        );
    })

    let isLoggedIn = (sessionStorage.getItem("userLoginStatus") === "success");
    if (isLoading) {
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
                <Typography style={{fontSize: 18, color: "#000000"}}>Loading...</Typography>
            </Grid>);
    } else {
        if (isLoggedIn)
            return (<UserDisplay/>);
        else
            return (<AuthorizationLinksDisplay/>);
    }
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
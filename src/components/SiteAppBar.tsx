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
import {ClearUserData} from "../utils/Login";
import {IsMobileResolution} from "../utils/MobileUtilities";

function LogOut() {
    ClearUserData();
    window.location.reload();
}

function WaitForLogin(onFinishedWaiting: Function) {
    let finishedWaiting = (sessionStorage.getItem("finishedWaiting") === "true");

    if (finishedWaiting) {
        onFinishedWaiting(false);
        return;
    }
    const loginCheckIntervalMs = 10;
    const loginTimeMs = 8000;

    const loginInterval = setInterval(() => {
        finishedWaiting = (sessionStorage.getItem("finishedWaiting") === "true");
        if (finishedWaiting) {
            onFinishedWaiting(false);
            clearInterval(loginInterval);
        }
    }, loginCheckIntervalMs);

    const loginWaitTimer = setTimeout(() => {
        onFinishedWaiting(false);
        clearInterval(loginInterval);
        clearTimeout(loginWaitTimer);
        finishedWaiting = true;
    }, loginTimeMs);
}

function AuthorizationResult() {
    const [isLoading, setLoadingStatus] = useState(true);
    let isMobile = IsMobileResolution();
    let fontsize = isMobile ? 12 : 18;
    let fontStyle = {fontSize: fontsize, color: "#000000", width: "fit-content"};

    let isLoggedIn = (sessionStorage.getItem("userLoginStatus") === "success");

    useEffect(() => {
        WaitForLogin(setLoadingStatus);
    }, []);

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
            {isLoading ?
                <Typography style={fontStyle}>Loading...</Typography> :
                isLoggedIn ?
                    <Fragment>
                        <Typography style={fontStyle}>{sessionStorage.getItem("userName")}</Typography>
                        <Link style={fontStyle} to="/assets" onClick={LogOut}>Log out</Link>
                    </Fragment> :
                    <Fragment>
                        <Link style={fontStyle} to="/login">Log in</Link>
                        <Link style={fontStyle} to="/register">Register</Link>
                    </Fragment>
            }
        </Grid>);
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
                    <AuthorizationResult/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
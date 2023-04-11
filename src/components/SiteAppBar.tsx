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
import {IsMobileResolution} from "../utils/MobileUtilities";

function LogOut() {
    ClearUserData();
    window.location.reload();
}

function GetAuthorizationResult() {
    const [isLoading, setLoadingStatus] = useState(true);
    let isMobile = IsMobileResolution();
    let fontsize = isMobile ? 12 : 18;

    useEffect(() => {
        TryCookieLogin().then(() => {
                const timer = setTimeout(() => {
                    setLoadingStatus(false);
                }, 500);
                return () => clearTimeout(timer);
            }
        );
    })

    let isLoggedIn = (sessionStorage.getItem("userLoginStatus") === "success");
    let fontStyle = {fontSize: fontsize, color: "#000000"};
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
                    <GetAuthorizationResult/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
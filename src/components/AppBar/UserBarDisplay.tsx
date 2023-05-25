import {IsMobileResolution} from "../../utils/MobileUtilities";
import {GetUserName, IsLoading, IsLoggedIn, LogOut} from "../../utils/User/Login";
import {Box, Grid, Typography} from "@mui/material";
import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import {AccountBox} from "@mui/icons-material";

const parentGridStyle = {
    direction: "column",
    alignItems: "left",
    display: "grid",
    justifyContent: "flex-end"
}

const textGridStyle = {
    display: "grid",
    direction: "column",
    alignItems: "center",
    justifyItems: "start",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem"
}

export default function UserBarDisplay() {
    let isMobile = IsMobileResolution();
    let fontsize = isMobile ? 16 : 20;
    let fontStyle = {fontSize: fontsize, color: "#000000", width: "fit-content"};

    const isLoggedIn = IsLoggedIn();
    const isLoading = IsLoading();

    return (
        <Grid sx={parentGridStyle}>
            {isLoading ?
                <Typography style={fontStyle}>Loading...</Typography> :
                isLoggedIn ?
                    <Grid display="flex" gap="1rem">
                        <Grid sx={textGridStyle} justifyItems="end">
                            <Link to="/profile"
                                  style={{
                                      fontSize: fontsize,
                                      color: "#000000",
                                      width: "fit-content",
                                      textDecoration: "none"
                                  }}>{GetUserName()}</Link>
                            <Link style={{fontSize: fontsize * 0.8, width: "fit-content", color: "gray"}}
                                  to="/"
                                  onClick={LogOut}>
                                Log out
                            </Link>
                        </Grid>
                        <Box component={Link} to="/profile" style={{width: "6rem", height: "6rem"}}>
                            <AccountBox style={{width: "6rem", height: "6rem", color: "black"}}/>
                        </Box>
                    </Grid> :
                    <Grid sx={textGridStyle} paddingRight="6rem">
                        <Link style={fontStyle} to="/login">Log in</Link>
                        <Link style={fontStyle} to="/register">Register</Link>
                    </Grid>
            }
        </Grid>);
}
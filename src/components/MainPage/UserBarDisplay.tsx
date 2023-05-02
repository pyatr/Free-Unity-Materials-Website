import {IsMobileResolution} from "../../utils/MobileUtilities";
import {IsLoading, IsLoggedIn, LogOut} from "../../utils/Login";
import {Grid, Typography} from "@mui/material";
import React, {Fragment} from "react";
import {Link} from "react-router-dom";

export default function UserBarDisplay() {
    let isMobile = IsMobileResolution();
    let fontsize = isMobile ? 12 : 18;
    let fontStyle = {fontSize: fontsize, color: "#000000", width: "fit-content"};

    const isLoggedIn = IsLoggedIn();
    const isLoading = IsLoading();

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
import {IsMobileResolution} from "../../utils/MobileUtilities";
import {GetUserEmail, GetUserName, IsLoading, IsLoggedIn, LogOut} from "../../utils/User/Login";
import {Box, Grid, Typography} from "@mui/material";
import React, {Fragment, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {AccountBox} from "@mui/icons-material";
import {GetEmptyUserInfo, GetPublicUserInfo, PublicUserInfo} from "../../utils/User/GetPublicUserInfo";
import {DoesImageExist} from "../../utils/Files/DoesImageExist";

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
    const [currentUserInfo, setCurrentUserInfo] = useState<PublicUserInfo>(GetEmptyUserInfo());
    const [userHasAvatar, setUserHasAvatar] = useState<boolean | undefined>(undefined);

    let isMobile = IsMobileResolution();
    let fontsize = isMobile ? 16 : 20;
    let fontStyle = {fontSize: fontsize, color: "#000000", width: "fit-content"};

    const isLoggedIn = IsLoggedIn();
    const isLoading = IsLoading();

    if (userHasAvatar === undefined) {
        DoesImageExist(currentUserInfo.avatarLink, setUserHasAvatar);
    }

    const loadUserInfo = async () => {
        if (!isLoading && currentUserInfo.email === "") {
            const userEmail = GetUserEmail();
            if (userEmail != null) {
                const loadedUserInfo: PublicUserInfo = await GetPublicUserInfo(userEmail);
                setCurrentUserInfo(loadedUserInfo);
                setUserHasAvatar(undefined);
            }
        }
    }

    useEffect(() => {
        const loadUserInfoBridge = async () => loadUserInfo();
        loadUserInfoBridge();
    });
    return (
        <Grid sx={parentGridStyle}>
            {isLoading || currentUserInfo.email === "" && IsLoggedIn() || userHasAvatar === undefined ?
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
                                  }}>{currentUserInfo.userName}</Link>
                            <Link style={{fontSize: fontsize * 0.8, width: "fit-content", color: "gray"}}
                                  to="/"
                                  onClick={LogOut}>
                                Log out
                            </Link>
                        </Grid>
                        <Box component={Link} to="/profile" style={{width: "6rem", height: "6rem"}}>
                            {userHasAvatar === true ?
                                <Box style={{
                                    border: "2px",
                                    borderStyle: "solid",
                                    color: "black",
                                    margin: "0.75em",
                                    width: "4.5em",
                                    height: "4.5em",
                                    display: "grid",
                                    overflow: "hidden",
                                    justifyContent: "center"
                                }}>
                                    <img style={{height: "inherit", maxWidth: "none", maxHeight: "none"}}
                                         src={currentUserInfo.avatarLink}/>
                                </Box> :
                                <AccountBox style={{width: "6rem", height: "6rem", color: "black"}}/>}
                        </Box>
                    </Grid> :
                    <Grid sx={textGridStyle} paddingRight="6rem">
                        <Link style={fontStyle} to="/login">Log in</Link>
                        <Link style={fontStyle} to="/register">Register</Link>
                    </Grid>
            }
        </Grid>);
}
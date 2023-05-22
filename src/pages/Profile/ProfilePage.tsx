import React, {useEffect, useState} from 'react'
import {Grid, Typography} from "@mui/material";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import {AccountBox} from "@mui/icons-material";
import {GetUserEmail, IsLoggedIn, LogOut} from "../../utils/User/Login";
import {GetEmptyUserInfo, GetPublicUserInfo, PublicUserInfo} from "../../utils/User/GetPublicUserInfo";
import {Link} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {containerBoxStyle} from "../Register/RegisterPage";

const mainGridStyle = {
    display: "grid",
    justifyContent: "space-between",
    paddingLeft: "30%",
    paddingRight: "30%",
    paddingTop: "1%",
    paddingBottom: "5%",
    gap: "4em"
}

const userInfoGridStyle = {
    display: "grid",
    height: "fit-content",
    paddingTop: "2em",
    paddingBottom: "2em"
}

const userInfoTextStyle = {
    fontSize: "18px"
}

const bottomLinksStyle = {
    ":hover": {
        color: "black"
    },
    cursor: "pointer",
    color: "black",
    fontSize: "18px",
    marginTop: "0.5em",
    textDecoration: "none",
    width: "fit-content"
}

export function ProfilePage() {
    const [isLoading, setLoadingStatus] = useState(false);

    const [currentUserInfo, setCurrentUserInfo] = useState<PublicUserInfo>(GetEmptyUserInfo());

    const loadUserInfo = () => {
        if (!isLoading && currentUserInfo.email === "") {
            setLoadingStatus(true);
            const userEmail = GetUserEmail();
            GetPublicUserInfo(userEmail).then((loadedUserInfo: PublicUserInfo) => {
                setCurrentUserInfo(loadedUserInfo);
                setLoadingStatus(false);
            });
        }
    }

    useEffect(() => loadUserInfo());

    if (!IsLoggedIn()) {
        return (
            <Container component="main">
                <Box sx={containerBoxStyle}>
                    <Typography component="h1" variant="h5">
                        You must be logged in to view your profile.
                    </Typography>
                </Box>
            </Container>);
    }

    if (isLoading || currentUserInfo.email === "") {
        return (<LoadingOverlay position={"inherit"}/>);
    }

    return (
        <Grid sx={mainGridStyle}>
            <Grid sx={{display: "flex"}}>
                <AccountBox sx={{width: "10em", height: "10em"}}/>
                <Grid sx={userInfoGridStyle}>
                    <Typography style={userInfoTextStyle}>User name</Typography>
                    <Typography style={userInfoTextStyle}>{currentUserInfo.userName}</Typography>
                    <Typography style={userInfoTextStyle} marginTop="0.5em">E-Mail address</Typography>
                    <Typography style={userInfoTextStyle}>{currentUserInfo.email}</Typography>
                    <Typography style={userInfoTextStyle} marginTop="0.5em">Registration date</Typography>
                    <Typography style={userInfoTextStyle}>{currentUserInfo.registrationDate}</Typography>
                </Grid>
            </Grid>
            <Grid sx={userInfoGridStyle} paddingLeft="2em">
                <Link to="/change-email" style={bottomLinksStyle}>Change email</Link>
                <Typography style={bottomLinksStyle}>Change password (coming soon)</Typography>
                <Typography style={bottomLinksStyle}>Delete profile (coming soon)</Typography>
                <Typography style={bottomLinksStyle} onClick={LogOut}>Log out</Typography>
            </Grid>
        </Grid>)
}
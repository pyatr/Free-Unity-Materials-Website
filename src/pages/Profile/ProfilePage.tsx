import React, {Fragment, useEffect, useState} from 'react'
import {Grid, Typography} from "@mui/material";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import {AccountBox} from "@mui/icons-material";
import {ClearUserData, GetUserEmail, IsLoggedIn, LogOut} from "../../utils/User/Login";
import {GetEmptyUserInfo, GetPublicUserInfo, PublicUserInfo} from "../../utils/User/GetPublicUserInfo";
import {Link} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {containerBoxStyle} from "../Register/RegisterPage";
import MessageBoxYesNo from "../../components/MessageBoxes/MessageBoxYesNo";
import {DeleteUser} from "../../utils/User/DeleteUser";
import {GoToHomePage} from "../../utils/GoToHomePage";

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
    const [deleteWindowOpen, setDeleteWindow] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState<PublicUserInfo>(GetEmptyUserInfo());

    const confirmDelete = async () => {
        setDeleteWindow(false);
        if (currentUserInfo != null) {
            const deletionResult = await DeleteUser(currentUserInfo.email);
            if (deletionResult === 'success') {
                ClearUserData();
                GoToHomePage();
            }
        }
    }

    const cancelDelete = () => setDeleteWindow(false);

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
                <Link to="/change-password" style={bottomLinksStyle}>Change password</Link>
                {deleteWindowOpen ?
                    <MessageBoxYesNo message={"Are you sure you want to delete your profile?"}
                                     onConfirm={confirmDelete}
                                     onCancel={cancelDelete}
                                     parentWidth={"384px"}
                                     parentHeight={"256px"}/> :
                    <Fragment/>}
                <Typography style={bottomLinksStyle} onClick={() => setDeleteWindow(!deleteWindowOpen)}>
                    Delete profile
                </Typography>
                <Typography style={bottomLinksStyle} onClick={LogOut}>
                    Log out
                </Typography>
            </Grid>
        </Grid>)
}
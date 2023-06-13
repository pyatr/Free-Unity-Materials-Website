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
import FileSelection from "../../components/FileSelection";
import {DoesImageExist} from "../../utils/Files/DoesImageExist";
import {SetUserAvatar} from "../../utils/User/SetUserAvatar";
import FileToBase64 from "../../utils/Files/FileToBase64";
import URLFileToBase64 from "../../utils/Files/URLFileToBase64";
import {getImageSize} from "react-image-size";
import Notification from "../../components/Notification";

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
    const [errorMessage, setErrorMessage] = useState("");
    const [deleteWindowOpen, setDeleteWindow] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState<PublicUserInfo>(GetEmptyUserInfo());
    const [userHasAvatar, setUserHasAvatar] = useState<boolean | undefined>(undefined);

    const [maxWidth, maxHeight] = [2048, 2048];
    const maxFileSize = 8000000;//8 mb

    if (userHasAvatar === undefined) {
        DoesImageExist(currentUserInfo.avatarLink, setUserHasAvatar);
    }

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

    const loadUserInfo = async () => {
        if (!isLoading && currentUserInfo.email === "") {
            setLoadingStatus(true);
            const userEmail = GetUserEmail();
            const loadedUserInfo: PublicUserInfo = await GetPublicUserInfo(userEmail);
            setCurrentUserInfo(loadedUserInfo);
            setUserHasAvatar(undefined);
            setLoadingStatus(false);
        }
    }

    const loadNewAvatar = async (event: any) => {
        setLoadingStatus(true);
        let file: File = event.target.files[0];
        let errorMessage = "";
        let blob: string = URL.createObjectURL(file);
        let isImage: boolean = file.type.split("/")[0] === "image";
        if (!isImage) {
            errorMessage += "This is not an image.\n"
        } else {
            if (file.size > maxFileSize) {
                errorMessage += "Image too heavy. Max size is " + maxFileSize / 1000000 + " MB.\n";
            }
            const dimensions = await getImageSize(blob);
            if (dimensions.width > maxWidth) {
                errorMessage += "Image too wide (" + dimensions.width + "px). Max width is " + maxWidth + " px.\n";
            }
            if (dimensions.height > maxHeight) {
                errorMessage += "Image too tall (" + dimensions.height + "px). Max height is " + maxHeight + " px.\n";
            }
        }
        if (errorMessage != "") {
            setErrorMessage(errorMessage);
            setLoadingStatus(false);
            return;
        }
        let base64 = await FileToBase64(file);
        event.target.value = null;
        await SetUserAvatar(currentUserInfo.email, base64);
        window.location.reload();
    }

    useEffect(() => {
        const loadUserInfoBridge = async () => loadUserInfo();
        loadUserInfoBridge();
    });

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
            <Notification message={errorMessage} color={"red"} onDismiss={() => setErrorMessage("")}/>
            <Grid sx={{display: "flex", gap: "1em"}}>
                <Grid sx={{width: "15em", height: "15em"}}>
                    {userHasAvatar === true ?
                        <Box style={{
                            border: "2px",
                            borderStyle: "solid",
                            margin: "2em",
                            width: "11em",
                            height: "11em",
                            display: "grid",
                            overflow: "hidden",
                            justifyContent: "center"
                        }}>
                            <img style={{height: "inherit", maxWidth: "none", maxHeight: "none"}}
                                 src={currentUserInfo.avatarLink}/>
                        </Box> :
                        <AccountBox sx={{width: "9.6em", height: "9.6em"}}/>}
                    <Box width="fit-content" height="fit-content" paddingLeft="2em">
                        <FileSelection title={"Select avatar (Max size: ) " + maxFileSize / 1000000 + " MB"}
                                       inputType={"file"} multiple={false}
                                       loadImageFunction={loadNewAvatar}/>
                    </Box>
                </Grid>
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
import React, {Fragment, useState} from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {GoToHomePage} from "../../utils/GoToHomePage";
import Avatar from "@mui/material/Avatar";
import {AppRegistration} from "@mui/icons-material";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import Cookies from "universal-cookie";
import {ActivateUser, RequestVerificationLink} from "../../utils/User/UserActivation";
import {containerBoxStyle, submitButton} from "../Register/RegisterPage";
import {Route, Routes, useParams} from "react-router-dom";

export default function UserActivationRouter() {
    return (
        <Routes>
            <Route path="/" element={<UserActivationPage/>}/>
            <Route path="/:activationCode" element={<UserActivationLinkVerificationPage/>}/>
        </Routes>);
}

function UserActivationLinkVerificationPage() {
    let {activationCode} = useParams();

    const processActivationCode = async () => {
        const userEmail = localStorage.getItem("userEmailActivation");
        if (activationCode !== undefined && userEmail != null) {
            const activationCodeAsString: string = activationCode as string;

            const [receivedActivationStatus, loginCookie]: string[] = await ActivateUser(userEmail, activationCodeAsString);
            if (receivedActivationStatus === "success") {
                const cookies = new Cookies();
                const date = Date.now();
                const expirationDate = new Date(date + 1000 * 60 * 60 * 24);
                cookies.set("userLogin", loginCookie, {expires: expirationDate, path: '/'});
                GoToHomePage();
            }
        }
    }

    processActivationCode();

    return (<LoadingOverlay position={"fixed"}/>);
}

function UserActivationPage() {
    const userEmail = sessionStorage.getItem("userEmailActivation");
    const [isLoading, setLoadingStatus] = useState(false);

    return (
        <Container component="main">
            <Box sx={containerBoxStyle}>
                {isLoading ? <LoadingOverlay position={"fixed"}/> : <Fragment/>}
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <AppRegistration/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Your account is not activated
                </Typography>
                <Typography component="h1" variant="h5">
                    If you did not receive message with verification link click this button to try and get it again
                </Typography>
                <Box component="form"
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="email-field"
                               name="email"
                               label="Your email"
                               variant="standard"
                               value={userEmail}
                               disabled
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <Button variant="contained"
                            sx={submitButton}
                            onClick={() => {
                                setLoadingStatus(true);
                                RequestVerificationLink(userEmail as string, "activate").then(() => setLoadingStatus(false));
                            }}>
                        Send activation link
                    </Button>
                </Box>
            </Box>
        </Container>);
}
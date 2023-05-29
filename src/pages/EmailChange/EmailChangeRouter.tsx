import React, {Fragment, useEffect, useState} from "react";

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
import {ClearUserData, GetUserEmail, IsLoggedIn} from "../../utils/User/Login";
import {containerBoxStyle, submitButton} from "../Register/RegisterPage";
import {IsStringNullOrEmpty} from "../../utils/Strings/IsStringNullOrEmpty";
import Notification from "../../components/Notification";
import {ChangeUserEmail, CheckEmailValidationCode, SendUserEmailChangeLink} from "../../utils/User/ChangeUserEmail";
import {Route, Routes, useParams} from "react-router-dom";

export function EmailChangeRouter() {
    return (
        <Routes>
            <Route path="/" element={<EmailChangePage/>}/>
            <Route path="/:activationCode" element={<EmailChangeLinkVerificationPage/>}/>
        </Routes>);
}

function EmailChangeLinkVerificationPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);
    const [isCodeValid, setCodeValidity] = useState<boolean>();

    const userEmail = GetUserEmail();

    let {activationCode} = useParams();

    const checkActivationCode = async () => {
        if (isCodeValid) {
            return;
        }
        if (activationCode === undefined) {
            setCodeValidity(false);
            return;
        }
        if (isCodeValid === undefined && !isLoading) {
            setLoadingStatus(true);
            let isCodeValidLocal: boolean = await CheckEmailValidationCode(activationCode as string);
            setCodeValidity(isCodeValidLocal);
            setLoadingStatus(false);
        }
    }

    useEffect(() => {
        checkActivationCode();
    })

    const handleEmailChangeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (!isCodeValid) {
            setErrorMessage("Invalid activation code.");
            return;
        }

        let errorMessage = "";
        let newEmail = data.get("new-email") as string;
        let newEmailConfirmation = data.get("confirm-new-email") as string;
        let password = data.get("password") as string;
        newEmail = newEmail.trim();
        newEmailConfirmation = newEmailConfirmation.trim();

        if (IsStringNullOrEmpty(newEmail))
            errorMessage += "Enter email.\n";
        else if (!newEmail.includes("@"))
            errorMessage += newEmail + " is not a valid email address.\n";

        if (newEmail !== newEmailConfirmation) {
            errorMessage += "Email confirmation not correct.\n";
        }

        if (errorMessage !== "") {
            setErrorMessage(errorMessage);
        } else if (activationCode !== undefined) {
            setLoadingStatus(true);
            const [emailChangeResult, loginCookie] = await ChangeUserEmail(userEmail, newEmailConfirmation, password, activationCode);
            setLoadingStatus(false);

            if (emailChangeResult === "success") {
                ClearUserData();
                const cookies = new Cookies();
                const date = Date.now();
                const expirationDate = new Date(date + 1000 * 60 * 60 * 24);
                cookies.set("userLogin", loginCookie, {expires: expirationDate, path: '/'});
                GoToHomePage();
                return;
            }

            if (emailChangeResult === "no-password") {
                setErrorMessage("Please enter password.");
                return;
            }

            if (emailChangeResult === "wrong-password") {
                setErrorMessage("Please enter correct password.");
                return;
            }

            if (emailChangeResult === "same-email") {
                setErrorMessage("You can't use same email.");
                return;
            }

            if (emailChangeResult === "user-exists") {
                setErrorMessage("That email is already in use.");
                return;
            }

            setErrorMessage("Something went wrong when changing email.");
        }
    };

    if (!IsLoggedIn()) {
        return (
            <Container component="main">
                <Box sx={containerBoxStyle}>
                    <Typography component="h1" variant="h5">
                        You must be logged in to change password.
                    </Typography>
                </Box>
            </Container>);
    }

    if (!isCodeValid) {
        if (isLoading || isCodeValid === undefined) {
            return (<LoadingOverlay position={"fixed"}/>);
        } else {
            return (
                <Container component="main">
                    <Box sx={containerBoxStyle}>
                        <Typography component="h1" variant="h5">
                            Invalid code.
                        </Typography>
                    </Box>
                </Container>);
        }
    }

    return (
        <Container component="main">
            <Box sx={containerBoxStyle}>
                {isLoading ? <LoadingOverlay position={"fixed"}/> : <Fragment/>}
                <Notification message={errorMessage} color={"red"} onDismiss={() => setErrorMessage("")}/>
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <AppRegistration/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Type your new email.
                </Typography>
                <Box component="form"
                     onSubmit={handleEmailChangeSubmit}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="new-email-field"
                               name="new-email"
                               label="Enter new email"
                               variant="standard"
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <TextField id="confirm-new-email-field"
                               name="confirm-new-email"
                               label="Confirm new email"
                               variant="standard"
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <TextField id="password-field"
                               name="password"
                               label="Enter password"
                               variant="standard"
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <Button variant="contained"
                            sx={submitButton}
                            type="submit">
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Container>);
}

function EmailChangePage() {
    const userEmail = GetUserEmail();
    const [errorMessage, setErrorMessage] = useState("");
    const [notificationMessage, setNotification] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);

    const sendEmailChangeLinkToEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorMessage("");
        event.preventDefault();

        if (!IsStringNullOrEmpty(userEmail)) {
            setLoadingStatus(true);
            const codeAdditionResult = await SendUserEmailChangeLink(userEmail);
            setLoadingStatus(false);
            if (codeAdditionResult === "success") {
                setNotification("Email sent successfully. Please check your inbox for message with email change redirect link.");
                return;
            }
            if (codeAdditionResult === "failed") {
                setErrorMessage("Failed to send email or generate code. Please try again later.");
                return;
            }
            setErrorMessage("Unknown error.");
        }
    };

    if (!IsLoggedIn()) {
        return (
            <Container component="main">
                <Box sx={containerBoxStyle}>
                    <Typography component="h1" variant="h5">
                        You must be logged in to change email.
                    </Typography>
                </Box>
            </Container>);
    }

    return (
        <Container component="main">
            <Box sx={containerBoxStyle}>
                {isLoading ? <LoadingOverlay position={"fixed"}/> : <Fragment/>}
                <Notification message={errorMessage} color={"red"} onDismiss={() => setErrorMessage("")}/>
                <Notification message={notificationMessage} color={"blue"} onDismiss={() => setNotification("")}/>
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <AppRegistration/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Click "Send link" to receive link to your email change page.
                </Typography>
                <Box component="form"
                     onSubmit={sendEmailChangeLinkToEmail}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="your-email-field"
                               name="your-email"
                               label="Your email"
                               variant="standard"
                               value={userEmail}
                               disabled
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <Button variant="contained"
                            sx={submitButton}
                            type="submit">
                        Send link
                    </Button>
                </Box>
            </Box>
        </Container>);
}
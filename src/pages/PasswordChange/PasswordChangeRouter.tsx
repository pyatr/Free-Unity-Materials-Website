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
import {
    ChangeUserPassword,
    CheckPasswordValidationCode,
    SendUserPasswordChangeLink
} from "../../utils/User/ChangeUserPassword";
import {Route, Routes, useParams} from "react-router-dom";
import {DoesStringHaveNumbers} from "../../utils/Strings/DoesStringHaveNumbers";
import {DoesStringHaveCharacters} from "../../utils/Strings/DoesStringHaveCharacters";
import {IsStringWhiteSpaces} from "../../utils/Strings/IsStringWhiteSpaces";

export function PasswordChangeRouter() {
    return (
        <Routes>
            <Route path="/" element={<PasswordChangePage/>}/>
            <Route path="/:activationCode" element={<PasswordChangeLinkVerificationPage/>}/>
        </Routes>);
}

function PasswordChangeLinkVerificationPage() {
    const userEmail = GetUserEmail();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);
    const [isCodeValid, setCodeValidity] = useState<boolean>();

    const minPasswordLength = 5;

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
            let isCodeValidLocal: boolean = await CheckPasswordValidationCode(activationCode as string);
            setCodeValidity(isCodeValidLocal);
            setLoadingStatus(false);
        }
    }

    useEffect(() => {
        checkActivationCode();
    })

    const sendPasswordChangeLinkToEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const oldPassword = data.get("old-password") as string;
        const newPassword = data.get("new-password") as string;
        const confirmNewPassword = data.get("confirm-new-password") as string;

        let errorMessage = "";

        if (!DoesStringHaveNumbers(newPassword))
            errorMessage += "Password has to contain at least one number.\n";

        if (!DoesStringHaveCharacters(newPassword))
            errorMessage += "Password has to contain at least one character.\n";

        if (IsStringWhiteSpaces(newPassword))
            errorMessage += "Password can not be empty.\n";

        if (newPassword !== confirmNewPassword) {
            errorMessage += "Password and confirmation password do not match, please enter confirmation password correctly.\n"
        }

        if (errorMessage !== "") {
            setErrorMessage(errorMessage);
        } else if (activationCode !== undefined) {
            setLoadingStatus(true);
            const [passwordChangeResult, loginCookie] = await ChangeUserPassword(userEmail, oldPassword, newPassword, activationCode);
            setLoadingStatus(false);
            if (passwordChangeResult === "success") {
                ClearUserData();
                const cookies = new Cookies();
                const date = Date.now();
                const expirationDate = new Date(date + 1000 * 60 * 60 * 24);
                cookies.set("userLogin", loginCookie, {expires: expirationDate, path: '/'});
                GoToHomePage();
                return;
            }
            if (passwordChangeResult === "same-password") {
                setErrorMessage("You can't use same password.");
                return;
            }
            if (passwordChangeResult === "wrong-password") {
                setErrorMessage("Wrong old password.");
                return;
            }
            setErrorMessage("Unknown error.");
        }
    };

    if (!IsLoggedIn()) {
        if (isLoading) {
            return (<LoadingOverlay position={"fixed"}/>);
        } else {
            return (
                <Container component="main">
                    <Box sx={containerBoxStyle}>
                        <Typography component="h1" variant="h5">
                            You must be logged in to change password.
                        </Typography>
                    </Box>
                </Container>);
        }
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
                    Enter new password.
                </Typography>
                <Box component="form"
                     onSubmit={sendPasswordChangeLinkToEmail}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="old-password-field"
                               name="old-password"
                               label="Enter old password"
                               variant="standard"
                               type="password"
                               required
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <TextField id="new-password-field"
                               name="new-password"
                               label={"Enter new password (min: " + minPasswordLength + ")"}
                               variant="standard"
                               type="password"
                               inputProps={{minLength: minPasswordLength}}
                               required
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <TextField id="confirm-new-password-field"
                               name="confirm-new-password"
                               label="Confirm new password"
                               variant="standard"
                               type="password"
                               inputProps={{minLength: minPasswordLength}}
                               required
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

function PasswordChangePage() {
    const userEmail = GetUserEmail();
    const [errorMessage, setErrorMessage] = useState("");
    const [notificationMessage, setNotification] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);

    const sendActivationLinkToEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorMessage("");
        event.preventDefault();

        if (!IsStringNullOrEmpty(userEmail)) {
            setLoadingStatus(true);
            const codeAdditionResult = await SendUserPasswordChangeLink(userEmail);
            setLoadingStatus(false);
            if (codeAdditionResult === "success") {
                setNotification("Email sent successfully. Please check your inbox for message with password change redirect link.");
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
                        You must be logged in to change password.
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
                    Click "Send link" to receive link to your password change page.
                </Typography>
                <Box component="form"
                     onSubmit={sendActivationLinkToEmail}
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
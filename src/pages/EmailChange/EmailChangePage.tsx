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
import {ClearUserData, GetUserEmail, IsLoggedIn} from "../../utils/User/Login";
import {containerBoxStyle, submitButton} from "../Register/RegisterPage";
import {IsStringNullOrEmpty} from "../../utils/Strings/IsStringNullOrEmpty";
import Notification from "../../components/Notification";
import {ChangeUserEmail, SendUserEmailChangeCode} from "../../utils/User/ChangeUserEmail";

export default function EmailChangePage() {
    const userEmail = GetUserEmail();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);

    const sendCodeToNewEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorMessage("");
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let errorMessage = "";

        const newEmail = data.get("newEmail") as string;

        if (IsStringNullOrEmpty(newEmail))
            errorMessage += "Enter email\n";
        else if (!newEmail.includes("@"))
            errorMessage += newEmail + " is not a valid email address\n";

        if (errorMessage != "") {
            setErrorMessage(errorMessage);
        }

        if (!IsStringNullOrEmpty(userEmail)) {
            setLoadingStatus(true);
            const codeAdditionResult = await SendUserEmailChangeCode(userEmail, newEmail);
            setLoadingStatus(false);
            if (codeAdditionResult === "success") {
                return;
            }
            if (codeAdditionResult === "same-email") {
                setErrorMessage("You can't use same email");
                return;
            }
            if (codeAdditionResult === "user-exists") {
                setErrorMessage("That email is already in use");
                return;
            }
            setErrorMessage("Something went wrong when sending verification code");
        }
    };

    const handleActivationCodeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const verificationCode = data.get("verification-code") as string;
        if (verificationCode != null) {
            setLoadingStatus(true);
            const [emailChangeResult, loginCookie] = await ChangeUserEmail(userEmail, verificationCode);
            if (emailChangeResult === "success") {
                ClearUserData();
                const cookies = new Cookies();
                const date = Date.now();
                const expirationDate = new Date(date + 1000 * 60 * 60 * 24);
                cookies.set("userLogin", loginCookie, {expires: expirationDate});
                GoToHomePage();
            } else {
                setErrorMessage(verificationCode + " is not a valid verification code");
            }
            setLoadingStatus(false);
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
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <AppRegistration/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Enter new email and click "Send code" to send verification code.
                </Typography>
                <Box component="form"
                     onSubmit={sendCodeToNewEmail}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="email-field"
                               name="newEmail"
                               label="Email"
                               variant="standard"
                               required
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <Button variant="contained"
                            sx={submitButton}
                            type="submit">
                        Send code
                    </Button>
                </Box>
                <Box component="form"
                     onSubmit={handleActivationCodeSubmit}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="verification-code-field"
                               name="verification-code"
                               label="Confirmation code"
                               variant="standard"
                               required
                               sx={{marginTop: "16px", minWidth: "300px"}}></TextField>
                    <Button variant="contained"
                            sx={submitButton}
                            type="submit">
                        Confirm email
                    </Button>
                </Box>
            </Box>
        </Container>);
}
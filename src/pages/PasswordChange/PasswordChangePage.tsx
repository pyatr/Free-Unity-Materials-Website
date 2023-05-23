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
import ErrorNotification from "../../components/ErrorNotification";
import {ChangeUserPassword, SendUserPasswordChangeCode} from "../../utils/User/ChangeUserPassword";

export default function PasswordChangePage() {
    const userEmail = GetUserEmail();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);

    const sendCodeToNewEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let errorMessage = "";

        const oldPassword = data.get("oldPassword") as string;
        const newPassword = data.get("newPassword") as string;

        if (errorMessage != "") {
            setErrorMessage(errorMessage);
        }

        if (!IsStringNullOrEmpty(userEmail)) {
            setLoadingStatus(true);
            const codeAdditionResult = await SendUserPasswordChangeCode(userEmail, oldPassword, newPassword);
            setLoadingStatus(false);
            if (codeAdditionResult === "success") {
                return;
            }
            if (codeAdditionResult === "samepassword") {
                setErrorMessage("You can't use same password.");
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
            const [passwordChangeResult, loginCookie] = await ChangeUserPassword(userEmail, verificationCode);
            if (passwordChangeResult === "success") {
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
                        You must be logged in to change password.
                    </Typography>
                </Box>
            </Container>);
    }

    return (
        <Container component="main">
            <Box sx={containerBoxStyle}>
                {isLoading ? <LoadingOverlay position={"fixed"}/> : <Fragment/>}
                <ErrorNotification message={errorMessage} onDismiss={() => setErrorMessage("")}/>
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <AppRegistration/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Enter new password and click "Send code" to send verification code to your email.
                </Typography>
                <Box component="form"
                     onSubmit={sendCodeToNewEmail}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="old-password-field"
                               name="oldPassword"
                               label="Enter old password"
                               variant="standard"
                               type="password"
                               required
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <TextField id="new-password-field"
                               name="newPassword"
                               label="Enter new password"
                               variant="standard"
                               type="password"
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
                        Confirm new password
                    </Button>
                </Box>
            </Box>
        </Container>);
}
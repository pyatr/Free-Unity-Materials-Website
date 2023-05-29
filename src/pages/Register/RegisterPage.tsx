import React, {Fragment, useState} from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Notification from "../../components/Notification";
import {IsStringNullOrEmpty} from "../../utils/Strings/IsStringNullOrEmpty";
import {StringContainsOneOfSymbols} from "../../utils/Strings/StringContainsOneOfSymbols";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import {Grid} from "@mui/material";
import {Register} from "../../utils/User/Register";
import Avatar from "@mui/material/Avatar";
import {AppRegistration} from "@mui/icons-material";
import Container from "@mui/material/Container";
import {IsStringWhiteSpaces} from "../../utils/Strings/IsStringWhiteSpaces";
import {DoesStringHaveNumbers} from "../../utils/Strings/DoesStringHaveNumbers";
import {DoesStringHaveCharacters} from "../../utils/Strings/DoesStringHaveCharacters";

const textFieldStyle = {
    marginTop: "16px",
    width: "300px",
    minWidth: "300px",
    maxWidth: "300px"
}

const submitButton = {
    marginTop: "24px",
    marginBottom: "16px",
    justifySelf: "center",
}

const containerBoxStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "5%"
}

export {containerBoxStyle, submitButton, textFieldStyle}

function CheckInput(email: string, username: string, password: string, passwordConfirmation: string): string {
    const badSymbols = ["'", '"', ":", ";"];

    let errorMessage = "";
    if (IsStringNullOrEmpty(email))
        errorMessage += "Enter email.\n";
    else if (!email.includes("@"))
        errorMessage += email + " is not a valid email address.\n";

    if (IsStringNullOrEmpty(username))
        errorMessage += "Enter username.\n";

    if (IsStringWhiteSpaces(username))
        errorMessage += "Username can not be empty or contain one of those symbols ' \" : ; \n";

    if (StringContainsOneOfSymbols(username, badSymbols))
        errorMessage += "Username has one of forbidden symbols " + badSymbols.join(", ") + "\n";

    if (!DoesStringHaveNumbers(password))
        errorMessage += "Password has to contain at least one number.\n";

    if (!DoesStringHaveCharacters(password))
        errorMessage += "Password has to contain at least one character.\n";

    if (IsStringWhiteSpaces(password))
        errorMessage += "Password can not be empty.\n";

    if (IsStringNullOrEmpty(password))
        errorMessage += "Enter password.\n";

    if (IsStringNullOrEmpty(passwordConfirmation))
        errorMessage += "Confirm password.\n";

    if (passwordConfirmation != password)
        errorMessage += "Passwords do not match, please enter correct password.\n";
    return errorMessage;
}

export function RegisterPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);
    const [isUserCreated, setUserCreated] = useState(false);
    const minUsernameLength = 2;
    const maxUsernameLength = 64;
    const minPasswordLength = 5;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorMessage("");
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        let email = data.get("email") as string;
        let username = data.get("username") as string;
        let password = data.get("password") as string;
        let passwordConfirmation = data.get("password-confirm") as string;
        email = email.trim();
        let errorMessage = CheckInput(email, username, password, passwordConfirmation);
        if (errorMessage === "") {
            setLoadingStatus(true);
            const registrationResult = await Register(email, username, password);
            switch (registrationResult) {
                case "userExists":
                    setErrorMessage("That email is already used");
                    break;
                case "userCreated":
                    localStorage.setItem("userEmailActivation", email);
                    setUserCreated(true);
                    break;
                case "failedToSendEmail":
                    setErrorMessage("Failed to send email to provided address. Please log in and click send code again.");
                    break;
            }
            setLoadingStatus(false);
        } else {
            setErrorMessage(errorMessage);
        }
    }

    if (isUserCreated) {
        return (
            <Container component="main">
                <Grid sx={containerBoxStyle}>
                    <Typography component="h1" variant="h5">
                        Thank you for registering!
                    </Typography>
                    <Typography component="h1" variant="h5">
                        Please check your inbox and click the provided link to activate your account.
                    </Typography>
                </Grid>
            </Container>);
    }

    return (
        <Container component="main">
            <Grid sx={containerBoxStyle}>
                {isLoading ? <LoadingOverlay position={"fixed"}/> : <Fragment/>}
                <Notification message={errorMessage} color={"red"} onDismiss={() => setErrorMessage("")}/>
                <Notification message={notificationMessage} color={"primary.main"}
                              onDismiss={() => setNotificationMessage("")}/>
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <AppRegistration/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form"
                     onSubmit={handleSubmit}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="email-field"
                               name="email"
                               label="Email"
                               variant="standard"
                               required
                               sx={textFieldStyle}/>
                    <TextField id="username-field"
                               name="username"
                               label={"User name (min: " + minUsernameLength + ", max: " + maxUsernameLength + ")"}
                               variant="standard"
                               inputProps={{minLength: minUsernameLength, maxLength: maxUsernameLength}}
                               required
                               sx={textFieldStyle}/>
                    <TextField id="password-field"
                               name="password"
                               label={"Password (min: " + minPasswordLength + ")"}
                               variant="standard"
                               type="password"
                               inputProps={{minLength: minPasswordLength}}
                               required
                               sx={textFieldStyle}/>
                    <TextField id="password-confirm-field"
                               name="password-confirm"
                               label="Confirm password"
                               variant="standard"
                               type="password"
                               required
                               sx={textFieldStyle}/>
                    <Button variant="contained"
                            sx={submitButton}
                            type="submit"
                            fullWidth>
                        Submit
                    </Button>
                </Box>
            </Grid>
        </Container>);
}
import React, {Fragment, useState} from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorNotification from "../../components/ErrorNotification";
import {IsStringNullOrEmpty} from "../../utils/Strings/IsStringNullOrEmpty";
import {StringContainsOneOfSymbols} from "../../utils/Strings/StringContainsOneOfSymbols";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import {Grid} from "@mui/material";
import {Register} from "../../utils/Register";
import Avatar from "@mui/material/Avatar";
import {AppRegistration} from "@mui/icons-material";
import Container from "@mui/material/Container";

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

function CheckInput(email: string, username: string, password: string, passwordConfirmation: string): string {
    const badSymbols = ["'", '"', "[", "]"];
    let errorMessage = "";
    if (IsStringNullOrEmpty(email))
        errorMessage += "Enter email\n";
    else if (!email.includes("@"))
        errorMessage += email + " is not a valid email address\n";

    if (IsStringNullOrEmpty(username))
        errorMessage += "Enter username\n";

    if (StringContainsOneOfSymbols(username, badSymbols))
        errorMessage += "Username has one of forbidden symbols " + badSymbols.join(", ") + "\n";

    if (IsStringNullOrEmpty(password))
        errorMessage += "Enter password\n";

    if (IsStringNullOrEmpty(passwordConfirmation))
        errorMessage += "Confirm password\n";

    if (passwordConfirmation != password)
        errorMessage += "Passwords do not match, please enter correct password\n";
    return errorMessage;
}

export function RegisterPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);
    const [isUserCreated, setUserCreated] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorMessage("");
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        let email = data.get("email") as string;
        let username = data.get("username") as string;
        let password = data.get("password") as string;
        let passwordConfirmation = data.get("password-confirm") as string;

        let errorMessage = CheckInput(email, username, password, passwordConfirmation);
        if (errorMessage === "") {
            setLoadingStatus(true);
            const registrationResult = await Register(email, username, password);
            if (registrationResult === "userExists") {
                setErrorMessage("That email is already used");
                setLoadingStatus(false);
            }
            if (registrationResult === "userCreated") {
                sessionStorage.setItem("userEmailActivation", email);
                setLoadingStatus(false);
                setUserCreated(true);
            }
        } else {
            setErrorMessage(errorMessage);
        }
    }

    const goToActivationPage = () => {
        window.open(window.location.protocol + "//" + window.location.hostname + "/activate", "_self");
    }

    if (isUserCreated) {
        return (
            <Container component="main">
                <Grid sx={containerBoxStyle}>
                    <Typography component="h1" variant="h5">
                        Thank you for registering!
                    </Typography>
                    <Typography component="h1" variant="h5">
                        Please go to account activation page and enter code we sent to your email.
                    </Typography>
                    <Button variant="contained"
                            sx={submitButton}
                            onClick={goToActivationPage}>
                        Go to activation page
                    </Button>
                </Grid>
            </Container>);
    }

    return (
        <Container component="main">
            <Grid sx={containerBoxStyle}>
                {isLoading ? <LoadingOverlay position={"fixed"}/> : <Fragment/>}
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <AppRegistration/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form"
                     onSubmit={handleSubmit}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <ErrorNotification message={errorMessage} onDismiss={() => setErrorMessage("")}/>
                    <TextField id="email-field"
                               name="email"
                               label="Email"
                               variant="standard"
                               required
                               sx={textFieldStyle}/>
                    <TextField id="username-field"
                               name="username"
                               label="Name"
                               variant="standard"
                               required
                               sx={textFieldStyle}/>
                    <TextField id="password-field"
                               name="password"
                               label="Password"
                               variant="standard"
                               type="password"
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
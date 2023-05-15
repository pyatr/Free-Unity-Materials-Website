import React, {useState} from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorNotification from "../../components/ErrorNotification";
import ServerConnection from "../../utils/ServerConnection";
import {IsStringNullOrEmpty} from "../../utils/Strings/IsStringNullOrEmpty";
import {StringContainsOneOfSymbols} from "../../utils/Strings/StringContainsOneOfSymbols";
import {AxiosResponse} from "axios";
import {TryLogin} from "../../utils/Login";
import {LoadingOverlay} from "../../components/LoadingOverlay";

const textFieldStyle = {
    marginTop: "16px",
    width: "300px",
    minWidth: "300px",
    maxWidth: "300px"
}

const submitButton = {
    marginTop: "24px",
    marginBottom: "16px",
    width: "fit-content",
    justifySelf: "center"
}

const containerBoxStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "5%"
}

export function RegisterPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);

    const badSymbols = ["'", '"', "[", "]"];

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setErrorMessage("");
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let errorMessage = "";
        let email = data.get("email") as string;
        let username = data.get("username") as string;
        let password = data.get("password") as string;
        let passwordConfirmation = data.get("password-confirm") as string;

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

        if (errorMessage == "") {
            let serverConnection = new ServerConnection();
            const attributes = {
                email: email,
                password: password,
                username: username
            }
            setLoadingStatus(true);
            await serverConnection.SendPostRequestPromise("createNewUser", attributes).then((response: AxiosResponse) => {
                if (response.data == "userExists") {
                    setErrorMessage("That email is already used");
                    setLoadingStatus(false);
                }
                if (response.data.loginStatus === "success") {
                    TryLogin(email, password);
                }
            });
        } else {
            setErrorMessage(errorMessage);
        }
    }
    if (isLoading) {
        return (<LoadingOverlay position={"fixed"}/>);
    }

    return (
        <Box sx={containerBoxStyle}>
            <Typography component="h1" variant="h5">Register</Typography>
            <Box component="form"
                 onSubmit={handleSubmit}
                 display='grid'
                 sx={{marginTop: "8px", justifyItems: "center"}}>
                <ErrorNotification message={errorMessage} onDismiss={() => setErrorMessage("")}/>
                <TextField id="email-field"
                           name="email"
                           label="Email"
                           variant="standard"
                           sx={textFieldStyle}/>
                <TextField id="username-field"
                           name="username"
                           label="Name"
                           variant="standard"
                           sx={textFieldStyle}/>
                <TextField id="password-field"
                           name="password"
                           label="Password"
                           variant="standard"
                           type="password"
                           fullWidth
                           sx={textFieldStyle}/>
                <TextField id="password-confirm-field"
                           name="password-confirm"
                           label="Confirm password"
                           variant="standard"
                           type="password"
                           fullWidth
                           sx={textFieldStyle}/>
                <Button variant="contained"
                        sx={submitButton}
                        type="submit">
                    Submit
                </Button>
            </Box>
        </Box>);
}
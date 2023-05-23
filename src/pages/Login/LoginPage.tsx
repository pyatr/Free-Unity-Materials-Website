import React, {Fragment, useState} from "react";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Link} from "react-router-dom";
import {TryLogin} from "../../utils/User/Login";
import {GoToHomePage} from "../../utils/GoToHomePage";
import {LoadingOverlay} from "../../components/LoadingOverlay";
import {containerBoxStyle, submitButton, textFieldStyle} from "../Register/RegisterPage";
import ErrorNotification from "../../components/ErrorNotification";

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setLoadingStatus] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email") as string;
        const password = data.get("password") as string;
        if (email != null && password != null) {
            setLoadingStatus(true);
            const loginStatus: string = await TryLogin(email, password);
            setLoadingStatus(false);
            if (loginStatus === "inactive") {
                sessionStorage.setItem("userEmailActivation", email);
                window.open(window.location.protocol + "//" + window.location.hostname + "/activate", "_self");
                return;
            }
            if (loginStatus === "could not login") {
                setErrorMessage("Wrong password or login");
                return;
            }
            GoToHomePage();
        }
    };
    return (
        <Container component="main">
            <Box sx={containerBoxStyle}>
                {isLoading ? <LoadingOverlay position={"fixed"}/> : <Fragment/>}
                <ErrorNotification message={errorMessage} onDismiss={() => setErrorMessage("")}/>
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form"
                     onSubmit={handleSubmit}
                     display='grid'
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="email-field"
                               name="email"
                               label="Email"
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
                    <Link to="/register" style={{marginTop: "16px", color: "black", width: "fit-content"}}>
                        Register
                    </Link>
                    <Link to="/register" style={{marginTop: "16px", color: "black", width: "fit-content"}}>
                        Forgot password?
                    </Link>
                    <Button variant="contained"
                            sx={submitButton}
                            type="submit">
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>);
}
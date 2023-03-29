import React from "react";
import "../../assets/LoginPage.css";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import ServerConnection from "../../utils/ServerConnection";
import {Link} from "react-router-dom";

function OnLoginResponse(response: string) {
    console.log("Response: " + response);
    let isLoggedIn = JSON.parse(response) === "true" ? true : false;
    localStorage.setItem("userLoginStatus", String(isLoggedIn));
    if (isLoggedIn) {
        window.open(window.location.origin, "_self")
    }
}


export default function LoginPage() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email;
        let emdata = data.get("email");
        if (emdata != null) {
            email = emdata.toString();
        }
        let password;
        let pdata = data.get("password");
        if (pdata != null) {
            password = pdata.toString();
        }
        if (email != null && password != null) {
            let scon: ServerConnection;
            scon = new ServerConnection();

            const params = {
                email: email,
                password: password
            };
            await scon.sendRequest("login", params, OnLoginResponse);
        }
    };

    return (
        <Container component="main">
            <Box
                width="100%"
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form"
                     onSubmit={handleSubmit}
                     display='grid'
                     sx={{mt: 1}}>
                    <TextField id="email-field"
                               name="email"
                               label="Email"
                               variant="standard"
                               sx={{mt: 2, minWidth: 300}}/>
                    <TextField id="password-field"
                               name="password"
                               label="Password"
                               variant="standard"
                               type="password"
                               fullWidth
                               sx={{mt: 2, minWidth: 300}}/>
                    <Link to="" style={{marginTop: '16px'}}>Register</Link>
                    <Link to="" style={{marginTop: '16px'}}>Forgot password?</Link>
                    <Button
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        type="submit"
                        fullWidth>Submit</Button>
                </Box>
            </Box>
        </Container>
    );
}
import React from "react";
import "./LoginDisplay.css";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import ServerConnection from "./ServerConnection";

const SERVER_URL = "http://fumserver.test";

//scon.sendTestRequest();
//scon.tryLogin("admin", "admin");

function Login() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email: string;
        // @ts-ignore: Object is possibly 'null'.
        email = data.get("email").toString();
        let password: string;
        // @ts-ignore: Object is possibly 'null'.
        password = data.get("password").toString();
        let scon: ServerConnection;
        scon = new ServerConnection(SERVER_URL);
        scon.tryLogin(email, password).then(() => {
            console.log("login successful");
        }, () => {
            console.log("login failed");
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
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
                     sx={{mt: 1}}>
                    <TextField id="email-field"
                               name="email"
                               label="Email"
                               variant="standard"
                               fullWidth
                               sx={{mt: 2}}/>
                    <TextField id="password-field"
                               name="password"
                               label="Password"
                               variant="standard"
                               type="password"
                               fullWidth
                               sx={{mt: 2}}/>
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


export default Login;
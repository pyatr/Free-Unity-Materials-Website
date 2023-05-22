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
import {ActivateUser, RequestVerificationCode} from "../../utils/User/UserActivation";
import {containerBoxStyle, submitButton} from "../Register/RegisterPage";

export default function UserActivationPage() {
    const userEmail = sessionStorage.getItem("userEmailActivation");
    const [isLoading, setLoadingStatus] = useState(false);

    const handleActivationCodeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email = data.get("email") as string;
        const verificationCode = data.get("verification-code") as string;
        if (email != null && verificationCode != null) {
            setLoadingStatus(true);
            const [verificationStatus, loginCookie]: string[] = await ActivateUser(email, verificationCode);
            if (verificationStatus === "success") {
                const cookies = new Cookies();
                const date = Date.now();
                const expirationDate = new Date(date + 1000 * 60 * 60 * 24);
                cookies.set("userLogin", loginCookie, {expires: expirationDate});
                GoToHomePage();
            }
        }
    };

    return (
        <Container component="main">
            <Box sx={containerBoxStyle}>
                {isLoading ? <LoadingOverlay position={"fixed"}/> : <Fragment/>}
                <Avatar sx={{margin: "16px", background: 'secondary.main'}}>
                    <AppRegistration/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Please input the account activation code we sent to your email
                </Typography>
                <Box component="form"
                     onSubmit={handleActivationCodeSubmit}
                     sx={{marginTop: "8px", display: "grid"}}>
                    <TextField id="email-field"
                               name="email"
                               label="Email"
                               variant="standard"
                               value={userEmail}
                               required
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <TextField id="verification-code-field"
                               name="verification-code"
                               label="Verification code"
                               variant="standard"
                               required
                               sx={{marginTop: "16px", minWidth: "300px"}}/>
                    <Button variant="contained"
                            sx={submitButton}
                            type="submit">
                        Activate
                    </Button>
                    <Button variant="contained"
                            sx={submitButton}
                            onClick={() => RequestVerificationCode(userEmail as string)}>
                        Send again
                    </Button>
                </Box>
            </Box>
        </Container>);
}
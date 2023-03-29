import React from "react";

import {Link} from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    Avatar,
    CssBaseline,
    Typography,
    Grid
} from "@mui/material";

export default function SiteAppBar() {
    let isLoggedIn = (localStorage.getItem("userLoginStatus") === "true");
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" color="default">
                <CssBaseline/>
                <Toolbar sx={{justifyContent: "space-between"}}>
                    <Avatar
                        variant="square"
                        src="./assets/logo.png"
                        alt="logo"
                        component={Link}
                        to="/"
                        sx={{
                            height: 169,
                            width: 410
                        }}/>

                    {!isLoggedIn ?
                        (<Grid
                            container
                            direction="column"
                            justifyContent="flex-end"
                            alignItems="left"
                            spacing={2}
                            sx={{
                                width: 300
                            }}>
                            <Link to="/login"> Log in</Link>
                            <Link to="/register">Register</Link>
                        </Grid>)
                        : (<Typography>Logged in, congrats</Typography>)}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
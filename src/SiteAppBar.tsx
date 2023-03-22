import React from "react";

import {Link} from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    Button,
    Avatar,
    Container, CssBaseline, Grid, Typography
} from "@mui/material";

function SiteAppBar() {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" color="default">
                <CssBaseline/>
                <Toolbar>
                    <Avatar
                        variant="square"
                        src="./assets/logo.png"
                        alt="logo"
                        sx={{
                            height: 169,
                            width: 410
                        }}/>

                    <Typography variant="h6" component="div"
                                sx={{flexGrow: 1}}/>

                    <Grid
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
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default SiteAppBar;
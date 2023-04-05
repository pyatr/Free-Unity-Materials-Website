import {BrowserRouter, Routes, Route} from "react-router-dom";

import {Box, Grid} from "@mui/material";

import "../../assets/HomePage.css";
import SiteAppBar from "../../components/SiteAppBar";
import LoginPage from "../Login/LoginPage";
import AssetsPage from "../AssetsPage/AssetsPage";
import ArticlesPage from "../Articles/ArticlesPage";
import ScriptsPage from "../Scripts/ScriptsPage";
import NonExistentPage from "../NonExistent/NonExistentPage";
import React, {Fragment} from "react";
import CategoryMenu from "../../components/CategoryMenu";

export default function HomePage() {
    //TODO: fix page opening as hostname/assets/ and showing Index of assets instead of actual page
    return (
        <BrowserRouter>
            <SiteAppBar/>
            <Grid container margin="1%">
                <Routes>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="register" element={<LoginPage/>}/>
                    <Route path="assets" element={<MainContent/>}/>
                    <Route path="articles" element={<MainContent/>}/>
                    <Route path="scripts" element={<MainContent/>}/>
                    <Route path="/" element={<MainContent/>}/>
                    <Route path="*" element={<MainContent/>}/>
                </Routes>
            </Grid>
        </BrowserRouter>
    );
}

function GetPage() {
    let cleanPath = window.location.pathname.substring(1, window.location.pathname.length);
    switch (cleanPath) {
        case "":
        case "/":
        case "assets":
            return (<AssetsPage/>);
        case "articles":
            return (<ArticlesPage/>);
        case "scripts":
            return (<ScriptsPage/>);
        default:
            return (<NonExistentPage/>);
    }
    return (<NonExistentPage/>);
}

function MainContent() {
    return (
        <Fragment>
            <CategoryMenu/>
            <Box sx={{
                p: 2,
                //71+12+12+1.5+1.5+1+1 = 100%
                width: '71%',
                height: '65vh',
                border: 2,
                borderColor: 'primary.main',
                m: '0.5%',
                borderRadius: 1,
                justifySelf: "stretch",
                alignSelf: "stretch",
            }}>
                <GetPage/>
            </Box>
        </Fragment>);
}

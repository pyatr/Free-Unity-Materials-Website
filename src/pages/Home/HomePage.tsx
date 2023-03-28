import {BrowserRouter, Routes, Route} from "react-router-dom";

import {Grid} from "@mui/material";

import "../../assets/HomePage.css";
import SiteAppBar from "../../components/SiteAppBar";
import LoginPage from "../Login/LoginPage";
import CategoryMenu from "../../components/CategoryMenu";
import AssetsPage from "../AssetsPage/AssetsPage";
import ArticlesPage from "../Articles/ArticlesPage";
import ScriptsPage from "../Scripts/ScriptsPage";
import NonExistentPage from "../NonExistent/NonExistentPage";
import React from "react";

export default function HomePage() {
    return (
        <BrowserRouter>
            <SiteAppBar/>
            <Grid container margin="1%">
                <Routes>
                    <Route path="/" element={<AssetsPage/>}/>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="register" element={<LoginPage/>}/>
                    <Route path="assets" element={<AssetsPage/>}/>
                    <Route path="articles" element={<ArticlesPage/>}/>
                    <Route path="scripts" element={<ScriptsPage/>}/>
                    <Route path="*" element={<NonExistentPage/>}/>
                </Routes>
            </Grid>
        </BrowserRouter>
    );
}
import {BrowserRouter, Routes, Route} from "react-router-dom";

import {Grid} from "@mui/material";

import "./assets/HomePage.css";
import SiteAppBar from "./components/SiteAppBar";
import LoginPage from "./pages/Login/LoginPage";
import AssetsPage from "./pages/AssetsPage/AssetsPage";
import ArticlesPage from "./pages/Articles/ArticlesPage";
import ScriptsPage from "./pages/Scripts/ScriptsPage";
import NonExistentPage from "./pages/NonExistent/NonExistentPage";
import MainContent from "./components/MainContent";
import {TryCookieLogin} from "./utils/Login";
import {useEffect, useState} from "react";

export type ContentProps = {
    mainElement: string
}

export default function App() {
    //TODO: fix page opening as hostname/assets/ and showing Index of assets instead of actual page
    TryCookieLogin();

    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight]);

    const updateWidthAndHeight = () => {
        setWidthHeight([window.innerWidth, window.innerHeight]);
    };

    useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });

    const assets = "AssetsPage";
    const articles = "ArticlesPage";
    const scripts = "ScriptsPage";
    const none = "NonExistentPage";

    return (
        <BrowserRouter>
            <SiteAppBar/>
            <Grid container margin="1%">
                <Routes>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="register" element={<LoginPage/>}/>
                    <Route path="assets" element={<MainContent mainElement={assets}/>}/>
                    <Route path="articles" element={<MainContent mainElement={articles}/>}/>
                    <Route path="scripts" element={<MainContent mainElement={scripts}/>}/>
                    <Route path="/" element={<MainContent mainElement={assets}/>}/>
                    <Route path="*" element={<MainContent mainElement={none}/>}/>
                </Routes>
            </Grid>
        </BrowserRouter>
    );
}
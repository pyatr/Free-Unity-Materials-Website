import {BrowserRouter, Routes, Route} from "react-router-dom";

import {Grid} from "@mui/material";

import "../../assets/HomePage.css";
import SiteAppBar from "../../components/SiteAppBar";
import LoginPage from "../Login/LoginPage";
import AssetsPage from "../AssetsPage/AssetsPage";
import ArticlesPage from "../Articles/ArticlesPage";
import ScriptsPage from "../Scripts/ScriptsPage";
import NonExistentPage from "../NonExistent/NonExistentPage";
import MainContent from "../../components/MainContent";
import {TryCookieLogin} from "../../utils/Login";
import {ReactNode} from "react";

export type ContentProps = {
    mainElement: ReactNode
}


export default function App() {
    //TODO: fix page opening as hostname/assets/ and showing Index of assets instead of actual page
    TryCookieLogin();

    const assets = <AssetsPage/>;
    const articles = <ArticlesPage/>;
    const scripts = <ScriptsPage/>;
    const none = <NonExistentPage/>;

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
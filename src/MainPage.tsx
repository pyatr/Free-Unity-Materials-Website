import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import MainPageProfileLayout from "./MainPageProfileLayout";

import "./MainPage.css";
import Login from "./LoginDisplay";
import {
    AppBar,
    Box,
    Toolbar,
    Button,
    Avatar,
    Container,
    Link as MuiLink
} from "@mui/material";
import SiteAppBar from "./SiteAppBar";

function MainPage() {
    return (
        <BrowserRouter>
            <SiteAppBar/>
            <Routes>
                <Route path="/"
                       element={<MainPageProfileLayout/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="register" element={<Login/>}/>
                <Route path="assets" element={<MainPage/>}/>
                <Route path="articles" element={<Articles/>}/>
                <Route path="scripts" element={<Scripts/>}/>
                <Route path="*" element={<NoPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

function Articles() {
    return <h1>Articles</h1>;
};

function Scripts() {
    return <h1>Scripts</h1>;
};

function NoPage() {
    return <h1>404</h1>;
};


export default MainPage;
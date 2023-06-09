import {BrowserRouter, Routes, Route} from "react-router-dom";

import "./assets/HomePage.css";
import SiteAppBar from "./components/AppBar/SiteAppBar";
import LoginPage from "./pages/Login/LoginPage";
import MainContentLayout from "./components/Layouts/MainContentLayout";
import {IsLoggedIn, TryRememberLogin} from "./utils/User/Login";
import {useEffect, useState} from "react";
import {RegisterPage} from "./pages/Register/RegisterPage";
import UserActivationRouter from "./pages/UserActivation/UserActivationRouter";
import {ProfilePage} from "./pages/Profile/ProfilePage";
import {EmailChangeRouter} from "./pages/EmailChange/EmailChangeRouter";
import {PasswordChangeRouter} from "./pages/PasswordChange/PasswordChangeRouter";

export default function App() {
    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight]);
    const [isLoggedIn, setLoggedInStatus] = useState(false);

    TryRememberLogin().then(() => {
        if (IsLoggedIn() != isLoggedIn) {
            setLoggedInStatus(IsLoggedIn());
        }
    });

    const updateWidthAndHeight = () => setWidthHeight([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });

    return (
        <BrowserRouter>
            <SiteAppBar/>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/activate/*" element={<UserActivationRouter/>}/>
                <Route path="/change-email/*" element={<EmailChangeRouter/>}/>
                <Route path="/change-password/*" element={<PasswordChangeRouter/>}/>
                <Route path="/articles/*" element={<MainContentLayout key="articles" elementTypeName="ArticlesPage"/>}/>
                <Route path="/scripts/*" element={<MainContentLayout key="scripts" elementTypeName="ScriptsPage"/>}/>
                <Route path="/*" element={<MainContentLayout key="assets" elementTypeName="AssetsPage"/>}/>
                <Route path="/search-all/*" element={<MainContentLayout key="search-all" elementTypeName="AllContentPage"/>}/>
            </Routes>
        </BrowserRouter>);
}
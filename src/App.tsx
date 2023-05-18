import {BrowserRouter, Routes, Route} from "react-router-dom";

import "./assets/HomePage.css";
import SiteAppBar from "./components/MainPage/SiteAppBar";
import LoginPage from "./pages/Login/LoginPage";
import MainContent from "./components/MainPage/MainContent";
import {IsLoggedIn, TryCookieLogin} from "./utils/Login";
import {useEffect, useState} from "react";
import {RegisterPage} from "./pages/Register/RegisterPage";
import UserActivationPage from "./pages/UserActivation/UserActivationPage";

export default function App() {
    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight]);
    const [isLoggedIn, setLoggedInStatus] = useState(false);

    TryCookieLogin().then(() => {
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
                <Route path="/activate" element={<UserActivationPage/>}/>
                <Route path="/articles/*" element={<MainContent key={"articles"} propValue={"ArticlesPage"}/>}/>
                <Route path="/scripts/*" element={<MainContent key={"scripts"} propValue={"ScriptsPage"}/>}/>
                <Route path="/*" element={<MainContent key={"assets"} propValue={"AssetsPage"}/>}/>
            </Routes>
        </BrowserRouter>
    );
}
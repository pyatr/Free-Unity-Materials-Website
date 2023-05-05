import {BrowserRouter, Routes, Route} from "react-router-dom";

import "./assets/HomePage.css";
import SiteAppBar from "./components/MainPage/SiteAppBar";
import LoginPage from "./pages/Login/LoginPage";
import AssetsPage from "./pages/AssetsPage/AssetsPage";
import ArticlesPage from "./pages/Articles/ArticlesPage";
import ScriptsPage from "./pages/Scripts/ScriptsPage";
import NonExistentPage from "./pages/NonExistent/NonExistentPage";
import MainContent from "./components/MainPage/MainContent";
import {IsLoggedIn, TryCookieLogin} from "./utils/Login";
import {useEffect, useState} from "react";

export type ContentProps = {
    mainElement: string
}

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

    const assets = "AssetsPage";
    const articles = "ArticlesPage";
    const scripts = "ScriptsPage";
    const none = "NonExistentPage";

    return (
        <BrowserRouter>
            <SiteAppBar/>
            <Routes>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<LoginPage/>}/>
                <Route path="articles" element={<MainContent mainElement={articles}/>}/>
                <Route path="scripts" element={<MainContent mainElement={scripts}/>}/>
                <Route path="/" element={<MainContent mainElement={assets}/>}/>
                <Route path="*" element={<MainContent mainElement={none}/>}/>
            </Routes>
        </BrowserRouter>
    );
}
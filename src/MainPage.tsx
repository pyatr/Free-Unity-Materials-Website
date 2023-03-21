import React from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";

import MainPageProfileLayout from "./MainPageProfileLayout";

import "./MainPage.css";

function MainPage() {
    return (
        <BrowserRouter>
            <div><img src="./assets/logo.png" alt="logo" className="Logo"/></div>
            <div className="Generic-link" >
            <Routes>
                <Route path="/" element={<MainPageProfileLayout/>}>
                    <Route path="login" element={<LoginLink/>}/>
                    <Route path="register" element={<RegisterLink/>}/>
                    <Route path="*" element={<NoPage/>}/>
                </Route>
            </Routes>
            </div>
        </BrowserRouter>
    );

}

function LoginLink() {
    return (<div><Link className="Generic-link" to="/login">Login</Link>
    </div>);
}

function RegisterLink() {
    return (<div><Link className="Generic-link" to="/register">Register</Link>
    </div>);
}

function NoPage() {
    return <h1>404</h1>;
};


export default MainPage;
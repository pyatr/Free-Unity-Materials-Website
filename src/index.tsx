import React from 'react';
import ReactDOM from 'react-dom/client';

import MainPage from './MainPage';
import LoginDisplay from "./LoginDisplay";
import {createBrowserRouter} from "react-router-dom";

import ServerConnection from "./ServerConnection";

const SERVER_URL = "http://fumserver.test";

let scon: ServerConnection;
scon = new ServerConnection(SERVER_URL);
//scon.sendTestRequest();
//scon.tryLogin("admin", "admin");

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([{
    path: "/login",
    element: <LoginDisplay/>
}]);

root.render(
    <React.StrictMode>
        <MainPage/>
    </React.StrictMode>
);


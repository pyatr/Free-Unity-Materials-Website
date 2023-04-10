import Cookies from "universal-cookie";
import ServerConnection from "./ServerConnection";
import {AxiosResponse} from "axios/index";
import React from "react";

export async function TryCookieLogin() {
    const cookie = new Cookies();
    let loginCookie = cookie.get("userLogin");
    if (loginCookie != null) {
        let scon = new ServerConnection();
        await scon.sendPostRequest("loginCookie", {}, OnCookieLoginResponse);
    }
}

export async function TryLogin(email: string, password: string) {
    let scon: ServerConnection;
    scon = new ServerConnection();

    const params = {
        email: email,
        password: password
    };
    await scon.sendPostRequest("login", params, OnLoginResponse);
}

function OnCookieLoginResponse(response: AxiosResponse) {
    var loginStatus = response.data.loginStatus.toString();
    if (loginStatus !== "success") {
        //Delete login cookie if it failed to log us in
        ClearUserData();
    } else {
        sessionStorage.setItem("userLoginStatus", loginStatus);
        sessionStorage.setItem("userName", response.data.userName);
    }
}


function OnLoginResponse(response: AxiosResponse) {
    try {
        if (response.data.loginStatus !== "success") {
            return;
        }
        const cookies = new Cookies();
        const date = Date.now();
        const expirationDate = new Date(date + 1000 * 60 * 60 * 24);
        cookies.set("userLogin", response.data.loginCookie, {expires: expirationDate});
        window.open(window.location.protocol + "//" + window.location.hostname, "_self");
    } catch (e) {
        console.log("Error when parsing login response: " + e);
    }
}

export function ClearUserData() {
    const cookies = new Cookies();
    cookies.remove("userLogin");
    sessionStorage.removeItem("userLoginStatus");
    sessionStorage.removeItem("userName");
}
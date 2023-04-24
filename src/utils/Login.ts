import Cookies from "universal-cookie";
import ServerConnection from "./ServerConnection";
import {AxiosResponse} from "axios/index";
import {GoToHomePage} from "./GoToHomePage";

export async function TryCookieLogin() {
    const cookie = new Cookies();
    let loginCookie = cookie.get("userLogin");
    if (loginCookie != null) {
        let scon = new ServerConnection();
        sessionStorage.removeItem("finishedWaiting");
        await scon.sendPostRequest("loginCookie", {}, OnCookieLoginResponse);
    } else {
        ClearUserData();
        sessionStorage.setItem("finishedWaiting", "true");
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
        sessionStorage.setItem("userRole", response.data.userRole);
    }
    sessionStorage.setItem("finishedWaiting", "true");
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
        GoToHomePage();
    } catch (e) {
        console.log("Error when parsing login response: " + e);
    }
}

export function LogOut() {
    ClearUserData();
    GoToHomePage();
}

export function CanUserEditContent(): boolean {
    const editorRoles = Array("ADMIN", "EDITOR");
    let userRole = sessionStorage.getItem("userRole");
    if (userRole == null)
        return false;
    return editorRoles.includes(userRole);
}

export function ClearUserData() {
    const cookies = new Cookies();
    cookies.remove("userLogin");
    sessionStorage.removeItem("userLoginStatus");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("finishedWaiting");
}
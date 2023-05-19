import Cookies from "universal-cookie";
import ServerConnection from "./ServerConnection";
import {GoToHomePage} from "./GoToHomePage";

export async function TryCookieLogin() {
    const cookie = new Cookies();
    let loginCookie = cookie.get("userLogin");
    if (loginCookie == null) {
        ClearUserData();
        return;
    }
    if (!IsLoggedIn()) {
        let serverConnection = new ServerConnection();
        sessionStorage.setItem("userLoginStatus", "loading");
        const {data} = await serverConnection.SendPostRequestPromise("loginCookie", {});
        const loginStatus = data.loginStatus.toString();
        if (loginStatus !== "success") {
            //Delete login cookie if it failed to log us in
            ClearUserData();
        } else {
            sessionStorage.setItem("userLoginStatus", loginStatus);
            sessionStorage.setItem("userName", data.userName);
            sessionStorage.setItem("userEmail", data.userEmail);
            sessionStorage.setItem("userRole", data.userRole);
        }
    }
}

export async function TryLogin(email: string, password: string): Promise<string> {
    let serverConnection: ServerConnection = new ServerConnection();

    const attributes = {
        email: email,
        password: password
    };
    const {data} = await serverConnection.SendPostRequestPromise("login", attributes);
    try {
        if (data.loginStatus === "success") {
            const cookies = new Cookies();
            const date = Date.now();
            const expirationDate = new Date(date + 1000 * 60 * 60 * 24);
            cookies.set("userLogin", data.loginCookie, {expires: expirationDate});
        }
        return data.loginStatus;
    } catch (e) {
        console.log("Error when parsing login response: " + e);
    }
    return "error";
}

export function IsLoggedIn(): boolean {
    return sessionStorage.getItem("userLoginStatus") === "success";
}

export function IsLoading(): boolean {
    return sessionStorage.getItem("userLoginStatus") === "loading";
}

export function LogOut() {
    ClearUserData();
    GoToHomePage();
}

export function GetUserName(): string {
    return sessionStorage.getItem("userName") as string;
}

export function GetUserEmail(): string {
    return sessionStorage.getItem("userEmail") as string;
}

export function CanUserEditContent(): boolean {
    const editorRoles = Array("ADMIN", "EDITOR");
    let userRole = sessionStorage.getItem("userRole");
    if (userRole == null)
        return false;
    return editorRoles.includes(userRole);
}

export function IsUserAdmin(): boolean {
    return sessionStorage.getItem("userRole") == "ADMIN";
}

export function ClearUserData() {
    const cookies = new Cookies();
    cookies.remove("userLogin");
    sessionStorage.removeItem("userLoginStatus");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userRole");
}
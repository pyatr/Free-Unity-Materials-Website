import ServerConnection from "../ServerConnection";

export type PublicUserInfo = {
    email: string,
    userName: string,
    role: string,
    registrationDate: string,
    isActive: string
}

export async function GetPublicUserInfo(email: string): Promise<PublicUserInfo> {
    let serverConnection: ServerConnection = new ServerConnection();

    const attributes = {
        email: email
    };
    const {data} = await serverConnection.SendPostRequestPromise("getPublicUserInfo", attributes);
    try {
        const userInfo: PublicUserInfo = {
            email: email,
            userName: data.userName,
            role: data.role,
            registrationDate: data.registrationDate,
            isActive: data.isActive
        }

        return userInfo;
    } catch (e) {
        console.log("Error when parsing login response: " + e);
    }

    return GetEmptyUserInfo();
}

export function GetEmptyUserInfo(): PublicUserInfo {
    return ({
        email: "",
        userName: "",
        role: "",
        registrationDate: "",
        isActive: ""
    });
}
import ServerConnection from "../ServerConnection";

export async function SendUserPasswordChangeCode(email: string, oldPassword: string, newPassword: string): Promise<string> {
    let serverConnection = new ServerConnection();

    const attributes = {
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword
    };
    const {data} = await serverConnection.SendPostRequestPromise("addCodeForUserPasswordChange", attributes);
    return data.codeAdditionResult;
}

export async function ChangeUserPassword(email: string, code: string): Promise<string[]> {
    let serverConnection = new ServerConnection();

    const attributes = {
        email: email,
        verificationCode: code
    };
    const {data} = await serverConnection.SendPostRequestPromise("changeUserPassword", attributes);
    return [data.passwordChangeResult, data.loginCookie];
}
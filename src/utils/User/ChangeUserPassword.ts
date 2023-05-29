import ServerConnection from "../ServerConnection";

export async function SendUserPasswordChangeLink(email: string): Promise<string> {
    let serverConnection = new ServerConnection();

    const attributes = {
        email: email
    };
    const {data} = await serverConnection.SendPostRequestPromise("addCodeForUserPasswordChange", attributes);
    return data.codeAdditionResult;
}

export async function ChangeUserPassword(email: string, oldPassword: string, newPassword: string, code: string): Promise<string[]> {
    let serverConnection = new ServerConnection();

    const attributes = {
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
        verificationCode: code
    };
    const {data} = await serverConnection.SendPostRequestPromise("changeUserPassword", attributes);
    return [data.passwordChangeResult, data.loginCookie];
}

export async function CheckPasswordValidationCode(code: string): Promise<boolean> {
    let serverConnection = new ServerConnection();

    const attributes = {
        verificationCode: code
    };
    const {data} = await serverConnection.SendPostRequestPromise("checkPasswordValidationCode", attributes);
    if (data.isCodeReal === undefined) {
        return false;
    } else {
        return data.isCodeReal === "exists";
    }
}
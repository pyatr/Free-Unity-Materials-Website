import ServerConnection from "../ServerConnection";

export async function SendUserEmailChangeLink(email: string): Promise<string> {
    let serverConnection = new ServerConnection();

    const attributes = {
        email: email
    };
    const {data} = await serverConnection.SendPostRequestPromise("addCodeForUserEmailChange", attributes);
    return data.codeAdditionResult;
}

export async function ChangeUserEmail(oldEmail: string, newEmail: string, password: string, code: string): Promise<string[]> {
    let serverConnection = new ServerConnection();

    const attributes = {
        email: oldEmail,
        newEmail: newEmail,
        password: password,
        verificationCode: code
    };
    const {data} = await serverConnection.SendPostRequestPromise("changeUserEmail", attributes);
    return [data.emailChangeResult, data.loginCookie];
}

export async function CheckEmailValidationCode(code: string): Promise<boolean> {
    let serverConnection = new ServerConnection();

    const attributes = {
        verificationCode: code
    };
    const {data} = await serverConnection.SendPostRequestPromise("checkEmailValidationCode", attributes);
    if (data.isCodeReal === undefined) {
        return false;
    } else {
        return data.isCodeReal === "exists";
    }
}
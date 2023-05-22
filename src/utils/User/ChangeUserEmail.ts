import ServerConnection from "../ServerConnection";

export async function SendUserEmailChangeCode(oldEmail: string, newEmail: string): Promise<string> {
    let serverConnection = new ServerConnection();

    const attributes = {
        email: oldEmail,
        newEmail: newEmail
    };
    const {data} = await serverConnection.SendPostRequestPromise("addCodeForUserEmailChange", attributes);
    return data.codeAdditionResult;
}

export async function ChangeUserEmail(oldEmail: string, code: string): Promise<string[]> {
    let serverConnection = new ServerConnection();

    const attributes = {
        email: oldEmail,
        verificationCode: code
    };
    const {data} = await serverConnection.SendPostRequestPromise("changeUserEmail", attributes);
    return [data.emailChangeResult, data.loginCookie];
}
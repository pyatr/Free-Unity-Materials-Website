import ServerConnection from "../ServerConnection";


export async function ActivateUser(email: string, verificationCode: string): Promise<string[]> {
    let serverConnection: ServerConnection = new ServerConnection();

    const attributes = {
        email: email,
        verificationCode: verificationCode
    };
    const {data} = await serverConnection.SendPostRequestPromise("activateUser", attributes);
    try {
        return [data.activationResult, data.loginCookie];
    } catch (e) {
        console.log("Error when parsing login response: " + e);
    }
    return ["failed", "no cookie"];
}

export async function RequestVerificationLink(email: string, pathname: string) {
    let serverConnection: ServerConnection = new ServerConnection();

    const attributes = {
        email: email,
        pathname: pathname
    };
    await serverConnection.SendPostRequestPromise("sendActivationLink", attributes);
}
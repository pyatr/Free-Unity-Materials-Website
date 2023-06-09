import ServerConnection from "../ServerConnection";

export async function Register(email: string, username: string, password: string): Promise<string> {
    let serverConnection = new ServerConnection();
    const attributes = {
        email: email,
        password: password,
        username: username
    }
    const {data} = await serverConnection.SendPostRequestPromise("user/register", attributes);
    return data.registrationResult;
}
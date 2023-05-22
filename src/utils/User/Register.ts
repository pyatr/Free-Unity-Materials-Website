import ServerConnection from "../ServerConnection";

export async function Register(email: string, username: string, password: string): Promise<string> {
    let serverConnection = new ServerConnection();
    const attributes = {
        email: email,
        password: password,
        username: username
    }
    const {data} = await serverConnection.SendPostRequestPromise("createNewUser", attributes);
    console.log(data);
    return data.registrationResult;
}
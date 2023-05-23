import ServerConnection from "../ServerConnection";

export async function DeleteUser(email: string): Promise<string> {
    let serverConnection: ServerConnection = new ServerConnection();

    const attributes = {
        email: email
    };
    const {data} = await serverConnection.SendPostRequestPromise("deleteUser", attributes);
    return data.deletionResult;
}
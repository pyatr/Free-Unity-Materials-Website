import ServerConnection from "../ServerConnection";

export async function SetUserAvatar(email: string, avatarImageBase64: string) {
    const serverConnection: ServerConnection = new ServerConnection();

    const attributes = {
        email: email,
        avatarImageBase64: avatarImageBase64
    }
    const {data} = await serverConnection.SendPostRequestPromise("setUserAvatar", attributes);
}
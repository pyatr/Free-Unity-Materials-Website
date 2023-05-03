import {GetUserEmail} from "../Login";
import ServerConnection from "../ServerConnection";

export async function SendComment(contentNumber: number, contentCategory: string, comment: string): Promise<string> {
    let userEmail = GetUserEmail();
    const serverConnection = new ServerConnection();
    const params = {
        email: userEmail,
        content: comment,
        category: contentCategory,
        parentNumber: contentNumber
    };
    const {data} = await serverConnection.SendPostRequestPromise("addComment", params);
    return data;
}
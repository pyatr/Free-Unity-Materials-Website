import {GetDummyContent} from "../Types/Content/ContentUnit";
import ServerConnection from "../ServerConnection";

export async function GetContent(contentNumber: number, contentCategory: string): Promise<any> {
    if (contentNumber < 1) {
        return GetDummyContent();
    }
    const serverConnection = new ServerConnection();
    const params = {
        number: contentNumber,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("getContent", params);
    return data.content[0];
}
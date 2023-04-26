import {GetDummyContent} from "../Types/Content/ContentUnit";
import ServerConnection from "../ServerConnection";

export async function GetContent(itemNumber: number, category: string): Promise<any> {
    if (itemNumber < 1) {
        return GetDummyContent();
    }
    const serverConnection = new ServerConnection();
    const params = {
        number: itemNumber,
        category: category
    };
    const {data} = await serverConnection.SendPostRequestPromise("getContent", params);
    return data.content[0];
}
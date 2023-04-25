import {ContentItem, GetDummyContent} from "./Types/ContentItem";
import ServerConnection from "./ServerConnection";

export async function GetItem(itemNumber: number, requestName: string = "getContent"): Promise<ContentItem> {
    if (itemNumber < 1) {
        return GetDummyContent();
    }
    let scon = new ServerConnection();
    let params = {
        number: itemNumber
    };
    const {data} = await scon.SendPostRequestPromise(requestName, params);
    return data.content[0] as ContentItem;
}
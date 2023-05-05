import {GetDummyContentUnit} from "../Types/Content/ContentUnit";
import ServerConnection from "../ServerConnection";

export default async function DeleteContent(contentNumber: number, contentCategory: string): Promise<any> {
    if (contentNumber < 1) {
        return GetDummyContentUnit();
    }
    const serverConnection = new ServerConnection();
    const params = {
        number: contentNumber,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("deleteContent", params);
    return data;
}
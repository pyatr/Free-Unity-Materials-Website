import ServerConnection from "../ServerConnection";
import {PageData} from "../PageData/PageData";

export default async function GetPreviews(pageData: PageData): Promise<any> {
    const serverConnection = new ServerConnection();
    const params = {
        pageSize: pageData.pageSize,
        page: pageData.currentPage,
        category: pageData.getCategoryName()
    };

    //Use response.data.code for SQL request code and response.data.requesterror for error details
    const {data} = await serverConnection.SendPostRequestPromise("getPreviews", params);
    return data;
}
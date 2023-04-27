import ServerConnection from "../ServerConnection";
import {PageParameters} from "../PageParameters/PageParameters";

export default async function GetPreviews(pageParameters: PageParameters): Promise<any> {
    const serverConnection = new ServerConnection();
    const params = {
        pageSize: pageParameters.pageSize,
        page: pageParameters.currentPage,
        category: pageParameters.getCategoryName()
    };

    //Use response.data.code for SQL request code and response.data.requesterror for error details
    const {data} = await serverConnection.SendPostRequestPromise("getPreviews", params);
    return data;
}
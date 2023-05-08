import ServerConnection from "../ServerConnection";
import {PageParameters} from "../PageParameters/PageParameters";
import {ContentUnitPreview} from "../Types/Content/ContentUnitPreview";

export default async function GetPreviews(pageParameters: PageParameters): Promise<ContentUnitPreview[]> {
    const serverConnection = new ServerConnection();
    const params = {
        pageSize: pageParameters.pageSize,
        page: pageParameters.currentPage,
        category: pageParameters.getCategoryName()
    };

    //Use response.data.code for SQL request code and response.data.requesterror for error details
    const {data} = await serverConnection.SendPostRequestPromise("getPreviews", params);

    const previews: ContentUnitPreview[] = [];
    data.body.forEach((rawContentUnit: any) =>
        previews.push({
                contentID: rawContentUnit.NUMBER,
                title: rawContentUnit.TITLE,
                categories: rawContentUnit.CATEGORIES,
                body: rawContentUnit.CONTENT,
                titlepicLink: "http://" + window.location.host + ":8000/" + rawContentUnit.titlepicLink
            }
        )
    );
    pageParameters.setPostsCount(data.contentCount);

    return previews;
}
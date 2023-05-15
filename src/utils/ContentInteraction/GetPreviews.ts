import ServerConnection from "../ServerConnection";
import {PageProperties} from "../PageParameters/PageProperties";
import {ContentUnitPreview} from "../Types/Content/ContentUnitPreview";

export default async function GetPreviews(pageProperties: PageProperties): Promise<ContentUnitPreview[]> {
    const serverConnection = new ServerConnection();
    const attributes = {
        pageSize: pageProperties.pageSize,
        page: pageProperties.currentPage,
        category: pageProperties.getCategoryName()
    };

    //Use response.data.code for SQL request code and response.data.requesterror for error details
    const {data} = await serverConnection.SendPostRequestPromise("getPreviews", attributes);

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
    pageProperties.setPostsCount(data.contentCount);

    return previews;
}
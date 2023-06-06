import {ContentUnit, GetDummyContentUnit} from "../../utils/Types/Content/ContentUnit";
import ServerConnection from "../../utils/ServerConnection";

export async function GetContentUnit(contentID: number, contentCategory: string): Promise<ContentUnit> {
    if (contentID < 1) {
        return GetDummyContentUnit();
    }
    const serverConnection = new ServerConnection();
    const requestURL = "content/get-content";
    const requestParameters = "?id=" + contentID + "&category=" + contentCategory;
    const {data} = await serverConnection.SendGetRequestPromise(requestURL + requestParameters);
    const rawContent = data;
    const contentUnit = {
        contentID: rawContent.ID,
        title: rawContent.TITLE,
        categories: rawContent.CATEGORIES,
        body: rawContent.CONTENT,
        creationDate: rawContent.CREATION_DATE,
        galleryImageLinks: rawContent.GALLERY,
        fileLinks: rawContent.FILE_LINKS
    }
    return contentUnit;
}
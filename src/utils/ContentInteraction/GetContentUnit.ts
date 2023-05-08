import {ContentUnit, GetDummyContentUnit} from "../../utils/Types/Content/ContentUnit";
import ServerConnection from "../../utils/ServerConnection";

export async function GetContentUnit(contentID: number, contentCategory: string): Promise<ContentUnit> {
    if (contentID < 1) {
        return GetDummyContentUnit();
    }
    const serverConnection = new ServerConnection();
    const params = {
        number: contentID,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("getContent", params);
    const rawContent = data.body[0];
    const gallery: string[] = rawContent.GALLERY[0] != 'none' ? rawContent.GALLERY.map((link: string) => "http://" + window.location.host + ":8000/" + link) : [];
    const fileLinks: string[] = rawContent.FILE_LINKS[0] != 'none' ? rawContent.FILE_LINKS.map((link: string) => "http://" + window.location.host + ":8000/" + link) : [];
    const contentUnit = {
        contentID: rawContent.NUMBER,
        title: rawContent.TITLE,
        categories: rawContent.CATEGORIES,
        body: rawContent.CONTENT,
        creationDate: rawContent.CREATION_DATE,
        galleryImageLinks: gallery,
        fileLinks: fileLinks
    }
    return contentUnit;
}
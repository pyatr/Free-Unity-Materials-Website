import {ContentUnit, GetDummyContent} from "../Types/Content/ContentUnit";
import ServerConnection from "../ServerConnection";

export async function GetContent(contentNumber: number, contentCategory: string): Promise<ContentUnit> {
    if (contentNumber < 1) {
        return GetDummyContent();
    }
    const serverConnection = new ServerConnection();
    const params = {
        number: contentNumber,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("getContent", params);
    const rawContent = data.content[0];
    const gallery: string[] = rawContent.GALLERY[0] != 'none' ? rawContent.GALLERY.map((link: string) => "http://" + window.location.host + ":8000/" + link) : [];
    const fileLinks: string[] = rawContent.FILE_LINKS[0] != 'none' ? rawContent.FILE_LINKS.map((link: string) => "http://" + window.location.host + ":8000/" + link) : [];
    const conItem = {
        number: rawContent.NUMBER,
        title: rawContent.TITLE,
        categories: rawContent.CATEGORIES,
        content: rawContent.CONTENT,
        creationDate: rawContent.CREATION_DATE,
        gallery: gallery,
        fileLinks: fileLinks
    }
    return conItem;
}
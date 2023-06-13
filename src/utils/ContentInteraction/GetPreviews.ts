import ServerConnection from "../ServerConnection";
import {PageProperties} from "../PageProperties/PageProperties";
import {ContentUnitPreview} from "../Types/Content/ContentUnitPreview";
import {SitePagesProperties} from "../PageProperties/SitePagesProperties";

export default async function GetPreviews(pageProperties: PageProperties, nameFilter: string = ""): Promise<[ContentUnitPreview[], number]> {
    const serverConnection = new ServerConnection();
    const attributes = {
        pageSize: pageProperties.pageSize,
        page: pageProperties.currentPage,
        category: pageProperties.getCategoryName(),
        nameFilter: nameFilter
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
                primaryCategory: attributes.category,
                titlepicLink: rawContentUnit.titlepicLink != "noimages" ? "http://" + window.location.host + ":8000/" + rawContentUnit.titlepicLink : ""
            }
        )
    );

    return [previews, data.contentCount];
}

export async function GetAllPreviews(nameFilter: string = ""): Promise<ContentUnitPreview[]> {
    const serverConnection = new ServerConnection();
    const attributes = {
        nameFilter: nameFilter
    };

    const {data} = await serverConnection.SendPostRequestPromise("getAllPreviews", attributes);

    const previews: ContentUnitPreview[] = [];
    data.body.forEach((rawContentUnit: any) =>
        previews.push({
                contentID: rawContentUnit.NUMBER,
                title: rawContentUnit.TITLE,
                categories: rawContentUnit.CATEGORIES,
                body: rawContentUnit.CONTENT,
                primaryCategory: rawContentUnit.primaryCategory,
                titlepicLink: rawContentUnit.titlepicLink != "noimages" ? "http://" + window.location.host + ":8000/" + rawContentUnit.titlepicLink : ""
            }
        )
    );

    return previews;
}
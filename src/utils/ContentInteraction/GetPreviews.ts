import ServerConnection from "../ServerConnection";
import {PageProperties} from "../PageProperties/PageProperties";
import {ContentUnitPreview} from "../Types/Content/ContentUnitPreview";

export default async function GetPreviews(pageProperties: PageProperties, nameFilter: string = ""): Promise<[ContentUnitPreview[], number]> {
    const serverConnection = new ServerConnection();

    const requestURL = "content/get-previews";
    let requestParameters = "?page=" + pageProperties.currentPage + "&page-size=" + pageProperties.pageSize + "&category=" + pageProperties.getCategoryName();
    if (nameFilter != "")
        requestParameters += "&name-filter=" + nameFilter;
    const {data} = await serverConnection.SendGetRequestPromise(requestURL + requestParameters);

    const previews: ContentUnitPreview[] = [];

    data.posts.forEach((rawContentUnit: any) => {
        return previews.push({
            contentID: rawContentUnit.ID,
            title: rawContentUnit.TITLE,
            categories: rawContentUnit.CATEGORIES,
            body: rawContentUnit.CONTENT,
            primaryCategory: rawContentUnit.MAIN_CATEGORY,
            titlepicLink: rawContentUnit.titlepicLink
        });
    });

    return [previews, data.contentCount];
}
import ServerConnection from "../ServerConnection";

export async function GetCommentCount(parentID: number): Promise<number> {
    const serverConnection = new ServerConnection();
    const requestURL = "comments/get-comments-count";
    const requestParameters = "?parentID=" + parentID;
    const {data} = await serverConnection.SendGetRequestPromise(requestURL + requestParameters);
    return data as number;
}
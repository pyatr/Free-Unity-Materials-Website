import ServerConnection from "../ServerConnection";

export async function GetCommentCount(parentNumber: number, contentCategory: string): Promise<number> {
    const serverConnection = new ServerConnection();
    const params = {
        parentNumber: parentNumber,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("getCommentCount", params);
    return data as number;
}
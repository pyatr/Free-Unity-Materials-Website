import ServerConnection from "../ServerConnection";

export async function DeleteComment(commentID: number, contentCategory: string): Promise<any> {
    const serverConnection = new ServerConnection();
    const attributes = {
        commentID: commentID,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("deleteComment", attributes);
    return data;
}
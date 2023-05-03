import ServerConnection from "../ServerConnection";
import {UserCommentProps} from "../Types/UserCommentProps";

export async function GetComments(parentNumber: number, contentCategory: string): Promise<Array<UserCommentProps>> {
    const serverConnection = new ServerConnection();
    const params = {
        parentNumber: parentNumber,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("getComments", params);
    const preparedContent: Array<UserCommentProps> = (data as Array<any>).map(rawComment => {
        return {
            userEmail: rawComment.EMAIL,
            userName: rawComment.USERNAME,
            content: rawComment.CONTENT,
            creationDate: rawComment.CREATION_DATE
        }
    })
    return preparedContent;
}
import ServerConnection from "../ServerConnection";
import {UserCommentProps} from "../Types/UserCommentProps";

export async function GetComments(parentNumber: number, contentCategory: string): Promise<Array<UserCommentProps>> {
    const serverConnection = new ServerConnection();
    const params = {
        parentNumber: parentNumber,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("getComments", params);
    const preparedComments: Array<UserCommentProps> = (data.body as Array<any>).map(rawComment => {
        return {
            userEmail: rawComment.EMAIL,
            userName: rawComment.USERNAME,
            content: rawComment.CONTENT,
            creationDate: rawComment.CREATION_DATE,
            commentID: rawComment.NUMBER
        }
    })
    return preparedComments;
}
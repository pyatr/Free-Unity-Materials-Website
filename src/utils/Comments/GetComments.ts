import ServerConnection from "../ServerConnection";
import {UserCommentProps} from "../Types/UserCommentProps";

export async function GetComments(parentNumber: number, contentCategory: string): Promise<Array<UserCommentProps>> {
    const serverConnection = new ServerConnection();
    const attributes = {
        parentNumber: parentNumber,
        category: contentCategory
    };
    const {data} = await serverConnection.SendPostRequestPromise("getComments", attributes);
    const preparedComments: Array<UserCommentProps> = (data.body as Array<any>).map(rawCommentData => {
        return {
            userEmail: rawCommentData.EMAIL,
            userName: rawCommentData.USERNAME,
            userAvatarURL: rawCommentData.USER_AVATAR_URL,
            content: rawCommentData.CONTENT,
            creationDate: rawCommentData.CREATION_DATE,
            commentID: rawCommentData.NUMBER
        }
    })
    return preparedComments;
}
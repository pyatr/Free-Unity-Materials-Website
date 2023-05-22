import {GetUserEmail} from "../User/Login";
import ServerConnection from "../ServerConnection";
import {UserCommentProps} from "../Types/UserCommentProps";

export async function UpdateComment(commentID: number, contentCategory: string, comment: string): Promise<UserCommentProps> {
    const serverConnection = new ServerConnection();
    const attributes = {
        commentID: commentID,
        category: contentCategory,
        content: comment
    };
    const {data} = await serverConnection.SendPostRequestPromise("updateComment", attributes);
    const rawCommentData = data.body[0];
    const preparedComment: UserCommentProps = {
        userEmail: rawCommentData.EMAIL,
        userName: rawCommentData.USERNAME,
        content: rawCommentData.CONTENT,
        creationDate: rawCommentData.CREATION_DATE,
        commentID: rawCommentData.NUMBER
    }
    return preparedComment;
}
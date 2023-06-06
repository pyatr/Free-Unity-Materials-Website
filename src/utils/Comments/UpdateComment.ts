import ServerConnection from "../ServerConnection";
import {UserCommentProps} from "../Types/UserCommentProps";

export async function UpdateComment(commentID: number, contentCategory: string, comment: string): Promise<UserCommentProps> {
    const serverConnection = new ServerConnection();
    const attributes = {
        commentID: commentID,
        category: contentCategory,
        content: comment
    };
    const {data} = await serverConnection.SendPostRequestPromise("update-comment", attributes);
    const rawCommentData = data.body[0];
    const preparedComment: UserCommentProps = {
        userEmail: rawCommentData.EMAIL,
        userName: rawCommentData.USERNAME,
        userAvatarURL: rawCommentData.USER_AVATAR_URL,
        content: rawCommentData.CONTENT,
        creationDate: rawCommentData.CREATION_DATE,
        commentID: rawCommentData.NUMBER
    }
    return preparedComment;
}
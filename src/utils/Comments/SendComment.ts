import {GetUserEmail} from "../User/Login";
import ServerConnection from "../ServerConnection";
import {UserCommentProps} from "../Types/UserCommentProps";

export async function SendComment(contentNumber: number, contentCategory: string, comment: string): Promise<UserCommentProps> {
    let userEmail = GetUserEmail();
    const serverConnection = new ServerConnection();
    const attributes = {
        email: userEmail,
        content: comment,
        category: contentCategory,
        parentNumber: contentNumber
    };
    const {data} = await serverConnection.SendPostRequestPromise("addComment", attributes);
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
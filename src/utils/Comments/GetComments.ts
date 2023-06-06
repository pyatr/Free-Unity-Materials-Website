import ServerConnection from "../ServerConnection";
import {UserCommentProps} from "../Types/UserCommentProps";

export async function GetComments(parentID: number): Promise<Array<UserCommentProps>> {
    const serverConnection = new ServerConnection();
    const requestURL = "comments/get-comments";
    const requestParameters = "?parentID=" + parentID;
    const {data} = await serverConnection.SendGetRequestPromise(requestURL + requestParameters);
    const preparedComments: Array<UserCommentProps> = (data as Array<any>).map(rawCommentData => ({
        userEmail: rawCommentData.EMAIL,
        userName: rawCommentData.USERNAME,
        userAvatarURL: rawCommentData.USER_AVATAR_URL,
        content: rawCommentData.CONTENT,
        creationDate: rawCommentData.CREATION_DATE,
        commentID: rawCommentData.ID
    }));
    return preparedComments;
}
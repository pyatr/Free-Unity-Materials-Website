import React, {Fragment, useEffect, useState} from "react";
import {Button, Grid, TextField, Typography} from "@mui/material";
import {IsLoggedIn} from "../../utils/Login";
import {UserComment} from "./UserComment";
import {GetComments} from "../../utils/Comments/GetComments";
import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";
import {UserCommentProps} from "../../utils/Types/UserCommentProps";
import {sideButtonStyle} from "../MainPage/MainContent";
import {SendComment} from "../../utils/Comments/SendComment";
import {GetCommentCount} from "../../utils/Comments/GetCommentCount";
import {DeleteComment} from "../../utils/Comments/DeleteComment";

export function CommentSection({requestedContentID, requestedContentCategory}: ContentUnitRequestData) {
    const [userComment, setUserComment] = useState("");
    const [comments, setComments] = useState(Array<UserCommentProps>);
    const [commentCount, setCommentCount] = useState(-1);

    const [commentsPage, setCommentPage] = useState(0);

    const commentsPerPage = 10;

    const onCommentInputChange = (event: any) => {
        setUserComment(event.target.value);
    }

    const deleteComment = async (commentIDtoDelete: number) => {
        return DeleteComment(commentIDtoDelete, requestedContentCategory).then(() => {
            setComments(comments.filter(comment => comment.commentID !== commentIDtoDelete));
            setCommentCount(comments.length - 1);
        });
    };

    const editComment = async (commentID: number) => console.log("Will edit " + commentID);

    const sendComment = async () => {
        SendComment(requestedContentID, requestedContentCategory, userComment).then((newComment: UserCommentProps) => {
            setUserComment("");
            setComments(comments.concat(newComment));
            setCommentCount(comments.length + 1);
        });
    }

    useEffect(() => {
            if (commentCount == -1) {
                //TODO: Request limited amount of comments
                GetComments(requestedContentID, requestedContentCategory).then((comments: Array<UserCommentProps>) => {
                        setComments(comments);
                    }
                );
            }
        }
    );

    useEffect(() => {
        if (commentCount == -1) {
            GetCommentCount(requestedContentID, requestedContentCategory).then((commentCount: number) => setCommentCount(commentCount));
        }
    });

    const isLoggedIn = IsLoggedIn();

    const preparedComments = comments.map(comment => <UserComment userEmail={comment.userEmail}
                                                                  userName={comment.userName}
                                                                  content={comment.content}
                                                                  creationDate={comment.creationDate}
                                                                  commentID={comment.commentID}
                                                                  onEdit={editComment}
                                                                  onDelete={deleteComment}/>);

    return (
        <Grid marginTop="16px" marginBottom="16px" display="grid">
            {comments.length == 0 ?
                <Typography variant="h6" marginTop="16px" marginBottom="16px">Nobody commented yet</Typography> :
                <Fragment>
                    <Typography color="gray">{commentCount} comments</Typography>
                    <Grid gap="8px" border="1px solid" borderColor="black" display="grid" padding="4px"
                          marginBottom="16px">
                        {preparedComments}
                    </Grid>
                </Fragment>}
            {isLoggedIn ?
                <TextField onChange={onCommentInputChange}
                           label={"Add comment"}
                           value={userComment}
                           style={{marginTop: "16px", marginBottom: "16px"}}/> :
                <Fragment/>}
            {userComment != "" ?
                <Button onClick={() => sendComment()} style={sideButtonStyle}
                        sx={{width: "fit-content", paddingLeft: "16px", paddingRight: "16px"}}>
                    Submit
                </Button> :
                <Fragment/>}
        </Grid>);
}
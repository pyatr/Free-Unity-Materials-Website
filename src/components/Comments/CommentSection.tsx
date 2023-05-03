import React, {Fragment, useEffect, useState} from "react";
import {Button, Grid, TextField, Typography} from "@mui/material";
import {IsLoggedIn} from "../../utils/Login";
import {UserComment} from "./UserComment";
import {GetComments} from "../../utils/ContentInteraction/GetComments";
import {ContentUnitRequestData} from "../../utils/Types/Content/ContentUnitRequestData";
import {UserCommentProps} from "../../utils/Types/UserCommentProps";
import {sideButtonStyle} from "../MainPage/MainContent";
import {SendComment} from "../../utils/ContentInteraction/SendComment";
import {GetCommentCount} from "../../utils/ContentInteraction/GetCommentCount";

export function CommentSection({contentNumber, contentCategory}: ContentUnitRequestData) {
    const [userComment, setUserComment] = useState("");
    const [comments, setComments] = useState(Array<UserCommentProps>);
    const [commentCount, setCommentCount] = useState(-1);

    const [commentsPage, setCommentPage] = useState(0);

    const commentsPerPage = 10;

    const onCommentInputChange = (event: any) => {
        setUserComment(event.target.value);
    }

    const sendComment = async () => {
        SendComment(contentNumber, contentCategory, userComment).then((response: string) => {
            if (response === 'success') {
                setUserComment("");
                setComments([]);
                setCommentCount(-1);
            } else {
                console.log("Failed to send comment");
            }
        });
    }

    useEffect(() => {
            if (comments.length == 0) {
                //TODO: Request limited amount of comments
                GetComments(contentNumber, contentCategory).then((comments: Array<UserCommentProps>) => {
                        setComments(comments);
                    }
                );
            }
        }
    );

    useEffect(() => {
        if (commentCount == -1) {
            GetCommentCount(contentNumber, contentCategory).then((commentCount: number) => setCommentCount(commentCount));
        }
    });

    const isLoggedIn = IsLoggedIn();

    const preparedComments = comments.map(comment => <UserComment userEmail={comment.userEmail}
                                                                  userName={comment.userName}
                                                                  content={comment.content}
                                                                  creationDate={comment.creationDate}/>);

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
                           defaultValue={userComment}
                           style={{marginTop: "16px", marginBottom: "16px"}}/> :
                <Fragment/>}
            {userComment != "" ?
                <Button onClick={() => sendComment()} style={sideButtonStyle}>
                    Submit
                </Button> :
                <Fragment/>}
        </Grid>);
}
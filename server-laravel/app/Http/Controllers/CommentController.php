<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;

class CommentController extends BaseController
{
    public static function addComment(array $attributes): array
    {
        $email = self::tryGetValue($attributes, 'email');
        $content = self::tryGetValue($attributes, 'content');
        $parentNumber = self::tryGetValue($attributes, 'parentNumber');
        $comment = Comment::addComment($email, $content, $parentNumber);
        $email = $comment['body'][0]['EMAIL'];
        $comment['body'][0]['USERNAME'] = User::getUserName($email);
        $comment['body'][0]['USER_AVATAR_URL'] = UserController::getUserAvatar($email);
        return $comment;
    }

    public static function updateComment(array $attributes): array
    {
        $content = self::tryGetValue($attributes, 'content');
        $commentID = self::tryGetValue($attributes, 'commentID');

        $comment = Comment::updateComment($content, $commentID);
        $email = $comment['body'][0]['EMAIL'];
        $comment['body'][0]['USERNAME'] = User::getUserName($email);
        $comment['body'][0]['USER_AVATAR_URL'] = UserController::getUserAvatar($email);
        return $comment;
    }

    public static function getComments(array $attributes): array
    {
        $parentID = self::tryGetValue($attributes, 'parentID');
        $comments = Comment::getComments($parentID);
        foreach ($comments as &$comment) {
            $email = $comment['EMAIL'];
            $comment['USERNAME'] = User::getUserName($email);
            $comment['USER_AVATAR_URL'] = UserController::getUserAvatar($email);
        }
        return $comments;
    }

    public static function getCommentCount(array $attributes): int
    {
        $parentID = self::tryGetValue($attributes, 'parentID');
        return Comment::getCommentCount($parentID);
    }

    public static function deleteComment(array $attributes): void
    {
        $commentID = self::tryGetValue($attributes, 'commentID');
        Comment::deleteComment($commentID);
    }
}

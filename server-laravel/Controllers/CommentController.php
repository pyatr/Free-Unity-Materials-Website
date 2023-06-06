<?php

namespace Server;

use App\Models\Comment;

class CommentController extends BaseController
{
    private UserController $userController;
    private CommentModel $commentModel;
    private UserModel $userModel;

    public function __construct()
    {
        $this->userController = new UserController();
        $this->commentModel = new CommentModel();
        $this->userModel = new UserModel();
    }

    public function addComment(array $attributes): array
    {
        $email = $this->tryGetValue($attributes, 'email');
        $content = $this->tryGetValue($attributes, 'content');
        $category = $this->tryGetValue($attributes, 'category');
        $parentNumber = $this->tryGetValue($attributes, 'parentNumber');
        $comment = $this->commentModel->addComment($category, $email, $content, $parentNumber);
        $email = $comment['body'][0]['EMAIL'];
        $comment['body'][0]['USERNAME'] = $this->userModel->getUserName($email);
        $comment['body'][0]['USER_AVATAR_URL'] = $this->userController->getUserAvatar($email);
        return $comment;
    }

    public function updateComment(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');
        $content = $this->tryGetValue($attributes, 'content');
        $commentID = $this->tryGetValue($attributes, 'commentID');

        $comment = $this->commentModel->updateComment($category, $content, $commentID);
        $email = $comment['body'][0]['EMAIL'];
        $comment['body'][0]['USERNAME'] = $this->userModel->getUserName($email);
        $comment['body'][0]['USER_AVATAR_URL'] = $this->userController->getUserAvatar($email);
        return $comment;
    }

    public function getComments(array $attributes): array
    {
        $parentID = $this->tryGetValue($attributes, 'parentID');
        $comments = Comment::getComments($parentID);
        foreach ($comments as &$comment) {
            $email = $comment['EMAIL'];
            $comment['USERNAME'] = $this->userModel->getUserName($email);
            $comment['USER_AVATAR_URL'] = $this->userController->getUserAvatar($email);
        }
        return $comments;
    }

    public function getCommentCount(array $attributes): int
    {
        $parentID = $this->tryGetValue($attributes, 'parentID');
        return Comment::getCommentCount($parentID);
    }

    public function deleteComment(array $attributes): void
    {
        $category = $this->tryGetValue($attributes, 'category');
        $commentID = $this->tryGetValue($attributes, 'commentID');
        $this->commentModel->deleteComment($category, $commentID);
    }
}

<?php

namespace Server;

class CommentController extends BaseController
{
    private CommentModel $commentModel;
    private UserModel $userModel;

    public function __construct()
    {
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
        $comment['body'][0]['USERNAME'] = $this->userModel->getUserName($comment['body'][0]['EMAIL']);
        return $comment;
    }

    public function updateComment(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');
        $content = $this->tryGetValue($attributes, 'content');
        $commentID = $this->tryGetValue($attributes, 'commentID');

        $comment = $this->commentModel->updateComment($category, $content, $commentID);
        $comment['body'][0]['USERNAME'] = $this->userModel->getUserName($comment['body'][0]['EMAIL']);
        return $comment;
    }

    public function getComments(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');
        $parentNumber = $this->tryGetValue($attributes, 'parentNumber');
        $comments = $this->commentModel->getComments($category, $parentNumber);
        foreach ($comments['body'] as &$comment) {
            $comment['USERNAME'] = $this->userModel->getUserName($comment['EMAIL']);
        }
        return $comments;
    }

    public function getCommentCount(array $attributes): int
    {
        $category = $this->tryGetValue($attributes, 'category');
        $parentNumber = $this->tryGetValue($attributes, 'parentNumber');
        return $this->commentModel->getCommentCount($category, $parentNumber);
    }

    public function deleteComment(array $attributes)
    {
        $category = $this->tryGetValue($attributes, 'category');
        $commentID = $this->tryGetValue($attributes, 'commentID');
        $this->commentModel->deleteComment($category, $commentID);
    }
}
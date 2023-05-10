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

    public function addComment(array $attributes): string
    {
        $email = $this->tryGetValue($attributes, 'email');
        $content = $this->tryGetValue($attributes, 'content');
        $category = $this->tryGetValue($attributes, 'category');
        $parentNumber = $this->tryGetValue($attributes, 'parentNumber');
        return $this->commentModel->addComment($category, $email, $content, $parentNumber);
    }

    public function getComments(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');
        $parentNumber = $this->tryGetValue($attributes, 'parentNumber');
        $comments = $this->commentModel->getComments($category, $parentNumber);
        for ($i = 0; $i < count($comments); $i++) {
            $comments[$i]['USERNAME'] = $this->userModel->getUserName($comments[$i]['EMAIL']);
        }
        return $comments;
    }

    public function getCommentCount(array $attributes): int
    {
        $category = $this->tryGetValue($attributes, 'category');
        $parentNumber = $this->tryGetValue($attributes, 'parentNumber');
        return $this->commentModel->getCommentCount($category, $parentNumber);
    }
}
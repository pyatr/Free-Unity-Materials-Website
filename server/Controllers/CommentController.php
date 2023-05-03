<?php

namespace Server;

use Couchbase\User;

class CommentController extends BaseController
{
    private array $tablesForCategories;

    private CommentModel $commentModel;
    private UserModel $userModel;

    public function __construct()
    {
        $this->commentModel = new CommentModel();
        $this->userModel = new UserModel();
        $this->tablesForCategories = array("asset" => "ASSETS_COMMENTS", "article" => "ARTICLES_COMMENTS", "script" => "SCRIPTS_COMMENTS");
    }

    public function addComment(array $params): string
    {
        $email = $this->tryGetValue($params, 'email');
        $content = $this->tryGetValue($params, 'content');
        $category = $this->tryGetValue($params, 'category');
        $parentNumber = $this->tryGetValue($params, 'parentNumber');
        $tableName = $this->tablesForCategories[$category];
        return $this->commentModel->addComment($email, $content, $parentNumber, $tableName);
    }

    public function getComments(array $params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $parentNumber = $this->tryGetValue($params, 'parentNumber');
        $tableName = $this->tablesForCategories[$category];
        $comments = $this->commentModel->getComments($parentNumber, $tableName);
        for ($i = 0; $i < count($comments); $i++) {
            $comments[$i]['USERNAME'] = $this->userModel->getUserName($comments[$i]['EMAIL']);
        }
        return $comments;
    }

    public function getCommentCount(array $params): int
    {
        $category = $this->tryGetValue($params, 'category');
        $parentNumber = $this->tryGetValue($params, 'parentNumber');
        $tableName = $this->tablesForCategories[$category];
        return $this->commentModel->getCommentCount($parentNumber, $tableName);
    }
}
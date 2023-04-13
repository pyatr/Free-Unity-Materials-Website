<?php

namespace Server;

class ContentController extends BaseController
{
    private ContentModel $contentModel;

    public function __construct()
    {
        $this->contentModel = new ContentModel();
    }

    public function createPost($params): array
    {
        $title = $this->tryGetValue($params, "title");
        $shortTitle = $this->tryGetValue($params, "shortTitle");
        $content = $this->tryGetValue($params, "content");
        $categories = $this->tryGetValue($params, "categories");
        return $this->contentModel->createPost($title, $shortTitle, $content, $categories);
    }

    public function deletePost($params): array
    {
        $number = $this->tryGetValue($params, "number");
        return $this->contentModel->deletePost($number);
    }

    public function updatePost($params): array
    {
        $number = $this->tryGetValue($params, "number");
        $title = $this->tryGetValue($params, "title");
        $shortTitle = $this->tryGetValue($params, "shortTitle");
        $content = $this->tryGetValue($params, "content");
        $categories = $this->tryGetValue($params, "categories");
        return $this->contentModel->updatePost($number, $title, $shortTitle, $content, $categories);
    }

    public function getPost($params): array
    {
        $number = $this->tryGetValue($params, "number");
        return $this->contentModel->getPost($number);
    }

    public function getPosts($params): array
    {
        $pageSize = $this->tryGetValue($params, "pageSize");
        $page = $this->tryGetValue($params, "page");
        return $this->contentModel->getPosts($pageSize, $page);
    }
}
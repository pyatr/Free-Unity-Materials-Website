<?php

namespace Server;

class ContentController extends BaseController
{
    private ContentModel $contentModel;

    private string $titlepicFolder;

    public function __construct()
    {
        $this->contentModel = new ContentModel();
        $this->titlepicFolder = "http://" . $_SERVER["SERVER_ADDR"] . ":" . $_SERVER["SERVER_PORT"] . '/TitlePics/';
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
        $result = $this->contentModel->getPosts($pageSize, $page);
        $resultCount = count($result["content"]);
        for ($i = 0; $i < $resultCount; $i++) {
            $number = $result["content"][$i]["NUMBER"];
            $name = $this->titlepicFolder . $number . '.png';
            $result["content"][$i]["TITLEPIC_LINK"] = $name;
        }
        return $result;
    }
}
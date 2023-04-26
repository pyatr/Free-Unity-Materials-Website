<?php

namespace Server;

class ContentController extends BaseController
{
    private ContentModel $contentModel;

    private string $serverRoot = "/var/www/html/server";

    private array $tablesForCategories;
    private array $foldersForCategories;

    public function __construct()
    {
        $this->contentModel = new ContentModel();
        $this->tablesForCategories = array("asset" => "ASSETS", "article" => "ARTICLES", "script" => "SCRIPTS");
        $this->foldersForCategories = array("asset" => "Assets", "article" => "Articles", "script" => "Scripts");
    }

    public function createContent($params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $title = $this->tryGetValue($params, 'title');
        $content = $this->tryGetValue($params, 'content');
        $categories = $this->tryGetValue($params, 'categories');
        $response = $this->contentModel->createContent($tableName, $title, $content, $categories);
        //Enable image saving (and probably more): /var/www/html/server# chmod -R 777 TitlePics
        $lastID = $this->contentModel->getLastPostID();
        $folder = $this->foldersForCategories[$category];
        if ($response['result'] == 'success') {
            $galleryDirectory = "$this->serverRoot/Images/$folder/$lastID/Gallery";
            mkdir($galleryDirectory);
            $gallery = $this->tryGetValue($params, 'gallery');
            foreach ($gallery as $image) {
                $guid = GUIDCreator::GUIDv4();
                file_put_contents("$galleryDirectory/$guid.png", file_get_contents($image));
            }
        }
        $response['content']['itemID'] = $lastID;
        return $response;
    }

    public function deleteContent($params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $contentNumber = $this->tryGetValue($params, 'number');
        return $this->contentModel->deleteContent($tableName, $contentNumber);
    }

    public function updateContent($params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $contentNumber = $this->tryGetValue($params, 'number');
        $title = $this->tryGetValue($params, 'title');
        $content = $this->tryGetValue($params, 'content');
        $categories = $this->tryGetValue($params, 'categories');
        return $this->contentModel->updateContent($tableName, $contentNumber, $title, $content, $categories);
    }

    public function getContent($params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $contentNumber = $this->tryGetValue($params, 'number');
        return $this->contentModel->getContent($tableName, $contentNumber);
    }

    public function getContentPreviews($params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $pageSize = $this->tryGetValue($params, 'pageSize');
        $page = $this->tryGetValue($params, 'page');
        $result = $this->contentModel->getContentPreviews($tableName, $pageSize, $page);

        $resultCount = count($result['content']);
        $folder = $this->foldersForCategories[$category];

        for ($i = 0; $i < $resultCount; $i++) {
            $contentNumber = $result['content'][$i]['NUMBER'];
            $directory = "/Images/$folder/$contentNumber/Gallery";
            $previewName = scandir("$this->serverRoot/$directory/")[2];
            $result['content'][$i]['titlepicLink'] = ":$_SERVER[SERVER_PORT]/$directory/$previewName";
        }
        return $result;
    }
}
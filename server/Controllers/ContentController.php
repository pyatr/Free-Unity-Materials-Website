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
        $folder = $this->foldersForCategories[$category];

        $title = $this->tryGetValue($params, 'title');
        $content = $this->tryGetValue($params, 'content');
        $categories = $this->tryGetValue($params, 'categories');
        $response = $this->contentModel->createContent($tableName, $title, $content, $categories);
        //Enable image saving (and probably more): /var/www/html/server# chmod -R 777 TitlePics
        $lastID = $this->contentModel->getLastPostID();
        if ($response['result'] == 'success') {
            $this->loadImages($params, $lastID);
        }
        $response['content']['itemID'] = $lastID;
        return $response;
    }

    public function deleteContent($params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $folder = $this->foldersForCategories[$category];

        $contentNumber = $this->tryGetValue($params, 'number');
        $result = $this->contentModel->deleteContent($tableName, $contentNumber);
        if (file_exists("$this->serverRoot/Images/$folder/$contentNumber")) {
            FileManager::DeleteFolder("$this->serverRoot/Images/$folder/$contentNumber");
        }
        return $result;
    }

    public function updateContent($params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $folder = $this->foldersForCategories[$category];

        $contentNumber = $this->tryGetValue($params, 'number');
        $title = $this->tryGetValue($params, 'title');
        $content = $this->tryGetValue($params, 'content');
        $categories = $this->tryGetValue($params, 'categories');
        $response = $this->contentModel->updateContent($tableName, $contentNumber, $title, $content, $categories);
        if ($response['result'] == 'success') {
            if (file_exists("$this->serverRoot/Images/$folder/$contentNumber")) {
                FileManager::DeleteFolder("$this->serverRoot/Images/$folder/$contentNumber");
            }
            $this->loadImages($params, $contentNumber);
        }
        return $response;
    }

    private function loadImages($params, $contentNumber)
    {
        $category = $this->tryGetValue($params, 'category');
        $folder = $this->foldersForCategories[$category];
        $assetImageDirectory = "$this->serverRoot/Images/$folder/$contentNumber";
        $galleryDirectory = "$assetImageDirectory/Gallery";

        mkdir($assetImageDirectory);
        mkdir($galleryDirectory);
        $gallery = $this->tryGetValue($params, 'gallery');
        $i = 1;
        foreach ($gallery as $image) {
            //Alternative name: $guid = GUIDCreator::GUIDv4();
            file_put_contents("$galleryDirectory/$i.png", file_get_contents($image));
            $i++;
        }
    }

    public function getContent($params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $contentNumber = $this->tryGetValue($params, 'number');
        $response = $this->contentModel->getContent($tableName, $contentNumber);
        //Creating empty gallery array
        $folder = $this->foldersForCategories[$category];
        $response['content'][0]['GALLERY'][0] = 'none';
        if ($response['result'] == 'success') {
            $galleryDirectory = "Images/$folder/$contentNumber/Gallery";
            $imagesInGallery = scandir("$this->serverRoot/$galleryDirectory/");
            $imagesCount = count($imagesInGallery) - 2;
            if ($imagesCount > 0) {
                sort($imagesInGallery, SORT_NUMERIC);
                for ($i = 0; $i < $imagesCount; $i++) {
                    $response['content'][0]['GALLERY'][$i] = "$galleryDirectory/" . $imagesInGallery[$i + 2];
                }
            }
        }
        return $response;
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
            $galleryDirectory = "Images/$folder/$contentNumber/Gallery";
            $filesInDirectory = scandir("$this->serverRoot/$galleryDirectory/");
            if (count($filesInDirectory) > 2) {
                $previewName = $filesInDirectory[2];
                $result['content'][$i]['titlepicLink'] = "$galleryDirectory/$previewName";
            }
        }
        return $result;
    }
}
<?php

namespace Server;

class ContentController extends BaseController
{
    private ContentModel $contentModel;

    private array $tablesForCategories;
    private array $foldersForCategories;

    public function __construct()
    {
        $this->contentModel = new ContentModel();
        $this->tablesForCategories = ["asset" => "ASSETS", "article" => "ARTICLES", "script" => "SCRIPTS"];
        $this->foldersForCategories = ["asset" => "Assets", "article" => "Articles", "script" => "Scripts"];
    }

    public function createContent(array $params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];

        $title = $this->tryGetValue($params, 'title');
        $content = $this->tryGetValue($params, 'content');
        $categories = $this->tryGetValue($params, 'categories');
        $response = $this->contentModel->createContent($tableName, $title, $content, $categories);
        //Enable image saving (and probably more): /var/www/html/server# chmod -R 777 TitlePics
        $lastID = $this->contentModel->getLastPostID();
        if ($response['result'] == 'success') {
            $folder = $this->foldersForCategories[$category];
            $gallery = $this->tryGetValue($params, 'gallery');
            FileManager::saveImages($gallery, $folder, $lastID);
            $files = $this->tryGetValue($params, 'files');
            FileManager::saveFiles($files, $lastID);
        }
        $response['body']['itemID'] = $lastID;
        return $response;
    }

    public function deleteContent(array $params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $folder = $this->foldersForCategories[$category];

        $contentNumber = $this->tryGetValue($params, 'number');
        $result = $this->contentModel->deleteContent($tableName, $contentNumber);
        $imageFolder = __DIR__ . "/Images/$folder/$contentNumber";
        FileManager::deleteFolder($imageFolder);
        $filesFolder = __DIR__ . "/FileStorage/Assets/$contentNumber";
        FileManager::deleteFolder($filesFolder);
        return $result;
    }

    public function updateContent(array $params): array
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
            FileManager::deleteAllImages($folder, $contentNumber);
            $gallery = $this->tryGetValue($params, 'gallery');
            FileManager::saveImages($gallery, $folder, $contentNumber);
            $deleteFiles = $this->tryGetValue($params, 'deleteFiles');
            FileManager::deleteFiles($deleteFiles, $contentNumber);
            $files = $this->tryGetValue($params, 'files');
            FileManager::saveFiles($files, $contentNumber);
        }
        return $response;
    }

    public function getContent(array $params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $contentNumber = $this->tryGetValue($params, 'number');
        $response = $this->contentModel->getContent($tableName, $contentNumber);
        //Creating empty gallery array
        $folder = $this->foldersForCategories[$category];
        if ($response['result'] == 'success') {
            $response['body'][0]['GALLERY'] = FileManager::getImageLinks($folder, $contentNumber);
            $response['body'][0]['FILE_LINKS'] = FileManager::getFileLinks($contentNumber);
        }
        return $response;
    }

    public function getContentPreviews(array $params): array
    {
        $category = $this->tryGetValue($params, 'category');
        $tableName = $this->tablesForCategories[$category];
        $pageSize = $this->tryGetValue($params, 'pageSize');
        $page = $this->tryGetValue($params, 'page');
        $result = $this->contentModel->getContentPreviews($tableName, $pageSize, $page);

        $resultCount = count($result['body']);
        $folder = $this->foldersForCategories[$category];

        for ($i = 0; $i < $resultCount; $i++) {
            $contentNumber = $result['body'][$i]['NUMBER'];
            $galleryDirectory = "Images/$folder/$contentNumber/Gallery";
            if (is_dir(__DIR__ . "/$galleryDirectory/")) {
                $filesInDirectory = scandir(__DIR__ . "/$galleryDirectory/");
                if (count($filesInDirectory) > 2) {
                    $previewName = $filesInDirectory[2];
                    $result['body'][$i]['titlepicLink'] = "$galleryDirectory/$previewName";
                }
            } else {
                $result['body'][$i]['titlepicLink'] = "noimages";
            }
        }
        return $result;
    }
}
<?php

namespace Server;

class ContentController extends BaseController
{
    private ContentModel $contentModel;

    private string $serverRoot = "/var/www/html/server";
    private string $assetFilesDirectory;

    private array $tablesForCategories;
    private array $foldersForCategories;

    public function __construct()
    {
        $this->contentModel = new ContentModel();
        $this->tablesForCategories = array("asset" => "ASSETS", "article" => "ARTICLES", "script" => "SCRIPTS");
        $this->foldersForCategories = array("asset" => "Assets", "article" => "Articles", "script" => "Scripts");
        $this->assetFilesDirectory = "$this->serverRoot/FileStorage/Assets";
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
            $files = $this->tryGetValue($params, 'files');
            $gallery = $this->tryGetValue($params, 'gallery');
            $this->saveImages($gallery, $lastID, $folder);
            $this->saveFiles($files, $lastID);
        }
        $response['content']['itemID'] = $lastID;
        return $response;
    }

    public function deleteContent(array $params): array
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
            $galleryFolderName = "$this->serverRoot/Images/$folder/$contentNumber";
            if (file_exists($galleryFolderName)) {
                FileManager::DeleteFolder($galleryFolderName);
            }
            $gallery = $this->tryGetValue($params, 'gallery');
            $this->saveImages($gallery, $folder, $contentNumber);
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
            $response['content'][0]['GALLERY'] = $this->getImageLinks($folder, $contentNumber);
            $response['content'][0]['FILE_LINKS'] = $this->getFileLinks($contentNumber);
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

    private function saveImages(array $gallery, string $folder, int $contentNumber)
    {
        $currentContentImageDirectory = "$this->serverRoot/Images/$folder/$contentNumber";
        $galleryDirectory = "$currentContentImageDirectory/Gallery";

        mkdir($currentContentImageDirectory);
        mkdir($galleryDirectory);
        $imageNumber = 1;
        foreach ($gallery as $image) {
            //Alternative name: $guid = GUIDCreator::GUIDv4();
            file_put_contents("$galleryDirectory/$imageNumber.png", file_get_contents($image));
            $imageNumber++;
        }
    }

    private function getImageLinks(string $folder, int $contentNumber): array
    {
        $links[0] = 'none';
        $galleryDirectory = "Images/$folder/$contentNumber/Gallery";
        $imagesInGallery = scandir("$this->serverRoot/$galleryDirectory/");
        $imagesCount = count($imagesInGallery) - 2;
        if ($imagesCount > 0) {
            sort($imagesInGallery, SORT_NUMERIC);
            for ($i = 0; $i < $imagesCount; $i++) {
                $links[$i] = "$galleryDirectory/" . $imagesInGallery[$i + 2];
            }
        }
        return $links;
    }

    private function saveFiles(array $files, int $contentNumber)
    {
        $currentContentFileDirectory = "$this->serverRoot/FileStorage/Assets/$contentNumber";
        mkdir($currentContentFileDirectory);

        $fileNumber = 1;
        foreach ($files as $file) {
            $fileName = $this->tryGetValue($file, 'fileName');
            $fileContent = $this->tryGetValue($file, 'fileContent');
            $fileExtension = $this->tryGetValue($file, 'fileExtension');

            if ($fileName == "") {
                $fileName = GUIDCreator::GUIDv4();
            }
            if ($fileExtension != "") {
                $fileExtension = ".$fileExtension";
            }
            $fileName = str_replace(" ", "_", $fileName);
            //Putting files in folders, so they would be ordered in a way they were placed
            mkdir("$currentContentFileDirectory/$fileNumber");
            file_put_contents("$currentContentFileDirectory/$fileNumber/$fileName$fileExtension", file_get_contents($fileContent));
            $fileNumber++;
        }
    }

    private function getFileLinks(int $contentNumber): array
    {
        $links[0] = 'none';
        $currentContentFileDirectory = "FileStorage/Assets/$contentNumber";
        $fullFilePath = "$this->serverRoot/$currentContentFileDirectory";
        if (is_dir($fullFilePath)) {
            $filesInContentDirectory = scandir($fullFilePath);
            $fileCount = count($filesInContentDirectory) - 2;
            if ($fileCount > 0) {
                sort($filesInContentDirectory, SORT_NUMERIC);
                for ($i = 1; $i <= $fileCount; $i++) {
                    $fileName = scandir("$fullFilePath/$i")[2];
                    $links[$i - 1] = "$currentContentFileDirectory/$i/$fileName";
                }
            }
        }
        return $links;
    }
}
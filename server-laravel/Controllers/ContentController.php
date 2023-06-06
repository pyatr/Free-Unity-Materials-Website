<?php

namespace Server;

use App\Models\Content;
use Ramsey\Collection\Collection;

class ContentController extends BaseController
{
    private ContentModel $contentModel;

    public function __construct()
    {
        $this->contentModel = new ContentModel();
    }

    public function createContent(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');

        $title = $this->tryGetValue($attributes, 'title');
        $content = $this->tryGetValue($attributes, 'content');
        $categories = $this->tryGetValue($attributes, 'categories');
        $response = $this->contentModel->createContent($category, $title, $content, $categories);
        //Enable image saving (and probably more): /var/www/html/server# chmod -R 777 TitlePics
        $lastID = $this->contentModel->getLastPostID();
        if ($response['result'] == 'success') {
            $gallery = $this->tryGetValue($attributes, 'gallery');
            FileManager::saveImages($gallery, $category, $lastID);
            $files = $this->tryGetValue($attributes, 'files');
            FileManager::saveFiles($files, $category, $lastID);
        }
        $response['body']['itemID'] = $lastID;
        return $response;
    }

    public function deleteContent(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');

        $contentID = $this->tryGetValue($attributes, 'number');
        $result = $this->contentModel->deleteContent($category, $contentID);
        FileManager::deleteContentFiles($category, $contentID);
        return $result;
    }

    public function updateContent(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');

        $contentID = $this->tryGetValue($attributes, 'number');
        $title = $this->tryGetValue($attributes, 'title');
        $content = $this->tryGetValue($attributes, 'content');
        $categories = $this->tryGetValue($attributes, 'categories');
        $response = $this->contentModel->updateContent($category, $contentID, $title, $content, $categories);
        if ($response['result'] == 'success') {
            FileManager::deleteAllImages($category, $contentID);
            $gallery = $this->tryGetValue($attributes, 'gallery');
            FileManager::saveImages($gallery, $category, $contentID);
            $deleteFiles = $this->tryGetValue($attributes, 'deleteFiles');
            FileManager::deleteFiles($deleteFiles, $category, $contentID);
            $files = $this->tryGetValue($attributes, 'files');
            FileManager::saveFiles($files, $category, $contentID);
        }
        return $response;
    }

    public function getContent(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');
        $contentID = $this->tryGetValue($attributes, 'id');

        $requestResult = Content::getContent($category, $contentID);
        if (count($requestResult) > 0) {
            $requestResult = $requestResult[0];
            $requestResult['GALLERY'] = FileManager::getImageLinks($category, $contentID);
            $requestResult['FILE_LINKS'] = FileManager::getFileLinks($category, $contentID);
        }
        return $requestResult;
    }

    public function getContentPreviews(array $attributes): array
    {
        $category = $this->tryGetValue($attributes, 'category');
        $pageSize = $this->tryGetValue($attributes, 'page-size');
        $page = $this->tryGetValue($attributes, 'page');
        $nameFilter = $this->tryGetValue($attributes, 'name-filter');
        if ($nameFilter == null) {
            $nameFilter = '';
        }
        $result = Content::getContentPreviews($category != 'everything' ? $category : '', $nameFilter, $pageSize, $page);

        FileManager::loadImagesForPreviews($result, $category != 'everything' ? $category : 'asset');
        return $result;
    }
}

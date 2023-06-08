<?php

namespace App\Http\Controllers;

use App\Models\Content;
use App\Utilities\FileManager;

class ContentController extends BaseController
{
    public static function createContent(array $attributes): array
    {
        $category = self::tryGetValue($attributes, 'category');

        $title = self::tryGetValue($attributes, 'title');
        $content = self::tryGetValue($attributes, 'content');
        $categories = self::tryGetValue($attributes, 'categories');
        $response = Content::createContent($category, $title, $content, $categories);
        //Enable image saving (and probably more): /var/www/html/server# chmod -R 777 TitlePics
        $lastID = Content::getLastPostID();
        if ($response['result'] == 'success') {
            $gallery = self::tryGetValue($attributes, 'gallery');
            FileManager::saveImages($gallery, $category, $lastID);
            $files = self::tryGetValue($attributes, 'files');
            FileManager::saveFiles($files, $category, $lastID);
        }
        $response['body']['itemID'] = $lastID;
        return $response;
    }

    public static function deleteContent(array $attributes): array
    {
        $category = self::tryGetValue($attributes, 'category');

        $contentID = self::tryGetValue($attributes, 'number');
        $result = Content::deleteContent($category, $contentID);
        FileManager::deleteContentFiles($category, $contentID);
        return $result;
    }

    public static function updateContent(array $attributes): array
    {
        $category = self::tryGetValue($attributes, 'category');

        $contentID = self::tryGetValue($attributes, 'number');
        $title = self::tryGetValue($attributes, 'title');
        $content = self::tryGetValue($attributes, 'content');
        $categories = self::tryGetValue($attributes, 'categories');
        $response = Content::updateContent($category, $contentID, $title, $content, $categories);
        if ($response['result'] == 'success') {
            FileManager::deleteAllImages($category, $contentID);
            $gallery = self::tryGetValue($attributes, 'gallery');
            FileManager::saveImages($gallery, $category, $contentID);
            $deleteFiles = self::tryGetValue($attributes, 'deleteFiles');
            FileManager::deleteFiles($deleteFiles, $category, $contentID);
            $files = self::tryGetValue($attributes, 'files');
            FileManager::saveFiles($files, $category, $contentID);
        }
        return $response;
    }

    public static function getContent(array $attributes): array
    {
        $category = self::tryGetValue($attributes, 'category');
        $contentID = self::tryGetValue($attributes, 'id');

        $requestResult = Content::getContent($category, $contentID);
        if (count($requestResult) > 0) {
            $requestResult = $requestResult[0];
            $requestResult['GALLERY'] = FileManager::getImageLinks($category, $contentID);
            $requestResult['FILE_LINKS'] = FileManager::getFileLinks($category, $contentID);
        }
        return $requestResult;
    }

    public static function getContentPreviews(array $attributes): array
    {
        $category = self::tryGetValue($attributes, 'category');
        $pageSize = self::tryGetValue($attributes, 'page-size');
        $page = self::tryGetValue($attributes, 'page');
        $nameFilter = self::tryGetValue($attributes, 'name-filter');
        if ($nameFilter == null) {
            $nameFilter = '';
        }
        $result = Content::getContentPreviews($category != 'everything' ? $category : '', $nameFilter, $pageSize, $page);

        FileManager::loadImagesForPreviews($result, $category != 'everything' ? $category : 'asset');
        return $result;
    }
}

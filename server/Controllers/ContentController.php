<?php

namespace Server;

class ContentController extends BaseController
{
    private ContentModel $contentModel;

    private string $titlepicFolder;

    public function __construct()
    {
        $this->contentModel = new ContentModel();
        $this->titlepicFolder = ':' . $_SERVER['SERVER_PORT'] . '/TitlePics/';
    }

    public function createContent($params): array
    {
        $title = $this->tryGetValue($params, 'title');
        $shortTitle = $this->tryGetValue($params, 'shortTitle');
        $content = $this->tryGetValue($params, 'content');
        $categories = $this->tryGetValue($params, 'categories');
        $response = $this->contentModel->createContent($title, $shortTitle, $content, $categories);
        //Enable image saving (and probably more): /var/www/html/server# chmod -R 777 TitlePics
        $lastID = $this->contentModel->getLastPostID();
        if ($response['result'] == 'success') {
            $preview = $this->tryGetValue($params, 'preview');
            $saveLocation = "/var/www/html/server/TitlePics/$lastID.png";
            //echo $saveLocation . $preview;
            $savedImage = file_get_contents($preview);
            file_put_contents($saveLocation, $savedImage);
        }
        $response['content']['itemID'] = $lastID;
        return $response;
    }

    public function deleteContent($params): array
    {
        $contentNumber = $this->tryGetValue($params, 'number');
        return $this->contentModel->deleteContent($contentNumber);
    }

    public function updateContent($params): array
    {
        $contentNumber = $this->tryGetValue($params, 'number');
        $title = $this->tryGetValue($params, 'title');
        $shortTitle = $this->tryGetValue($params, 'shortTitle');
        $content = $this->tryGetValue($params, 'content');
        $categories = $this->tryGetValue($params, 'categories');
        return $this->contentModel->updateContent($contentNumber, $title, $shortTitle, $content, $categories);
    }

    public function getContent($params): array
    {
        $contentNumber = $this->tryGetValue($params, 'number');
        return $this->contentModel->getContent($contentNumber);
    }

    public function getContentPreviews($params): array
    {
        $pageSize = $this->tryGetValue($params, 'pageSize');
        $page = $this->tryGetValue($params, 'page');
        $result = $this->contentModel->getContentPreviews($pageSize, $page);
        $resultCount = count($result['content']);
        for ($i = 0; $i < $resultCount; $i++) {
            $contentNumber = $result['content'][$i]['NUMBER'];
            $name = $this->titlepicFolder . $contentNumber . '.png';
            $result['content'][$i]['TITLEPIC_LINK'] = $name;
        }
        return $result;
    }
}
<?php

namespace Server;

use PDO;

class ContentModel extends BaseModel
{
    static private array $tablesForCategories = ["asset" => "ASSETS", "article" => "ARTICLES", "script" => "SCRIPTS"];

    private const ENTRY_NUMBER = 'NUMBER';
    private const ENTRY_TITLE = 'TITLE';
    private const ENTRY_CONTENT = 'CONTENT';
    private const ENTRY_CATEGORIES = 'CATEGORIES';
    private const ENTRY_CREDATE = 'CREATION_DATE';

    private const SHORT_DESC_LENGTH = 128;

    public function createContent(string $category, string $title, string $content, string $categories): array
    {
        $tableName = self::$tablesForCategories[$category];
        $title = urlencode($title);
        $content = urlencode($content);

        $selectQueryObject = new InsertQueryBuilder();
        $selectQueryObject->
        insert($tableName, [$this::ENTRY_TITLE, $this::ENTRY_CONTENT, $this::ENTRY_CATEGORIES], [$title, $content, $categories]);
        return $this->executeRequest($selectQueryObject->getQuery());
    }

    public function updateContent(string $category, int $contentID, string $title, string $content, string $categories): array
    {
        $tableName = self::$tablesForCategories[$category];
        $title = urlencode($title);
        $content = urlencode($content);

        $updateQueryObject = new UpdateQueryBuilder();
        $updateQueryObject->
        update($tableName, [$this::ENTRY_TITLE, $this::ENTRY_CONTENT, $this::ENTRY_CATEGORIES], [$title, $content, $categories])->
        where([$this::ENTRY_NUMBER, '=', $contentID]);
        return $this->executeRequest($updateQueryObject->getQuery());
    }

    public function deleteContent(string $category, int $contentID): array
    {
        $tableName = self::$tablesForCategories[$category];
        $commentModel = new CommentModel();
        $commentModel->deleteCommentsFromContent($category, $contentID);

        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_NUMBER, '=', $contentID]);
        return $this->executeRequest($deleteQueryObject->getQuery());
    }

    public function getContent(string $category, int $contentID): array
    {
        $tableName = self::$tablesForCategories[$category];

        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(['*'])->
        from($tableName)->
        where([$this::ENTRY_NUMBER, '=', $contentID]);
        $response = $this->executeRequest($selectQueryObject->getQuery());
        $response['body'][0]['TITLE'] = urldecode($response['body'][0]['TITLE']);
        $response['body'][0]['CONTENT'] = urldecode($response['body'][0]['CONTENT']);
        return $response;
    }

    public function getContentPreviews(string $category, string $nameFilter, int $pageSize, int $page): array
    {
        $tableName = self::$tablesForCategories[$category];
        $postsOffset = $pageSize * ($page - 1);
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select([$this::ENTRY_NUMBER, $this::ENTRY_TITLE, $this::ENTRY_CATEGORIES, $this::ENTRY_CONTENT])->
        from($tableName)->
        orderBy('1', 'DESC')->
        limit($pageSize)->
        offset($postsOffset);
        if ($nameFilter != '') {
            $selectQueryObject->where([$this::ENTRY_TITLE, ' LIKE ', "'%$nameFilter%'"]);
        }
        $result = $this->executeRequest($selectQueryObject->getQuery());
        foreach ($result['body'] as &$resultBody) {
            $resultBody['TITLE'] = urldecode($resultBody['TITLE']);
            $resultBody['CONTENT'] = mb_strimwidth(urldecode($resultBody['CONTENT']), 0, $this::SHORT_DESC_LENGTH, "...");
        }
        $result['contentCount'] = $this->getContentCount($category, $nameFilter);
        return $result;
    }

    public function getAllContentPreviews(string $nameFilter): array
    {
        $allPreviews['body'] = [];
        foreach (self::$tablesForCategories as $tableName) {
            $category = array_search($tableName, self::$tablesForCategories);
            $selectQueryObject = new SelectQueryBuilder();
            $selectQueryObject->
            select([$this::ENTRY_NUMBER, $this::ENTRY_TITLE, $this::ENTRY_CATEGORIES, $this::ENTRY_CONTENT])->
            from($tableName)->
            orderBy('1', 'DESC');
            if ($nameFilter != '') {
                $selectQueryObject->where([$this::ENTRY_TITLE, ' LIKE ', "'%$nameFilter%'"]);
            }
            $result = $this->executeRequest($selectQueryObject->getQuery());
            foreach ($result['body'] as &$resultBody) {
                $resultBody['TITLE'] = urldecode($resultBody['TITLE']);
                $resultBody['CONTENT'] = mb_strimwidth(urldecode($resultBody['CONTENT']), 0, $this::SHORT_DESC_LENGTH, "...");
                $resultBody['primaryCategory'] = $category;
            }
            $allPreviews['body'] = array_merge($allPreviews['body'], $result['body']);
        }
        return $allPreviews;
    }

    public function getContentCount(string $category, string $nameFilter = '')
    {
        $tableName = self::$tablesForCategories[$category];
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(["COUNT(*)"])->
        from($tableName);
        if ($nameFilter != '') {
            $selectQueryObject->where([$this::ENTRY_TITLE, ' LIKE ', "'%$nameFilter%'"]);
        }
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return $request->fetch(PDO::FETCH_NAMED)['COUNT(*)'];
    }

    public function getLastPostID(): int
    {
        $selectQueryObject = new SelectQueryBuilder();
        //TODO: Is ; necessary for sql requests?
        $selectQueryObject->select(["LAST_INSERT_ID()"]);
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        //Should request LAST_INSERT_ID();
        return $request->fetch(PDO::FETCH_NAMED)['LAST_INSERT_ID()'];
    }
}

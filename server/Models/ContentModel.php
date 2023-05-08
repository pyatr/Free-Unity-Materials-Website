<?php

namespace Server;

use PDO;

class ContentModel extends BaseModel
{
    private const ENTRY_NUMBER = 'NUMBER';
    private const ENTRY_TITLE = 'TITLE';
    private const ENTRY_CONTENT = 'CONTENT';
    private const ENTRY_CATEGORIES = 'CATEGORIES';
    private const ENTRY_CREDATE = 'CREATION_DATE';

    private const SHORT_DESC_LENGTH = 128;

    public function createContent(string $tableName, string $title, string $content, string $categories): array
    {
        $selectQueryObject = new InsertQueryBuilder();
        $selectQueryObject->
        insert($tableName, [$this::ENTRY_TITLE, $this::ENTRY_CONTENT, $this::ENTRY_CATEGORIES], [$title, $content, $categories]);
        return $this->executeRequest($selectQueryObject->getQuery());
    }

    public function updateContent(string $tableName, int $contentNumber, string $title, string $content, string $categories): array
    {
        $query = "UPDATE $tableName SET "
            . $this::ENTRY_TITLE . "='$title',"
            . $this::ENTRY_CONTENT . "='$content',"
            . $this::ENTRY_CATEGORIES . "='$categories' WHERE " . $this::ENTRY_NUMBER . " = '$contentNumber'";
        return $this->executeRequest($query);
    }

    public function deleteContent(string $tableName, int $contentNumber): array
    {
        $query = "DELETE FROM $tableName WHERE " . $this::ENTRY_NUMBER . " = '$contentNumber'";
        return $this->executeRequest($query);
    }

    public function getContent(string $tableName, int $contentNumber): array
    {
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(['*'])->
        from($tableName)->
        where([$this::ENTRY_NUMBER, '=', $contentNumber]);
        return $this->executeRequest($selectQueryObject->getQuery());
    }

    public function getLastPostID(): string
    {
        $query = "SELECT LAST_INSERT_ID();";
        return $this->executeRequest($query)['body'][0]['LAST_INSERT_ID()'];
    }

    public function getContentPreviews(string $tableName, int $pageSize, int $page): array
    {
        $postsOffset = $pageSize * ($page - 1);
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select([$this::ENTRY_NUMBER, $this::ENTRY_TITLE, $this::ENTRY_CATEGORIES, $this::ENTRY_CONTENT])->
        from($tableName)->
        orderBy('1', 'DESC')->
        limit($pageSize)->
        offset($postsOffset);
        $result = $this->executeRequest($selectQueryObject->getQuery());
        for ($i = 0; $i < count($result['body']); $i++) {
            $result['body'][$i]['CONTENT'] = mb_strimwidth($result['body'][$i]['CONTENT'], 0, $this::SHORT_DESC_LENGTH, "...");
        }
        $result['contentCount'] = $this->getContentCount($tableName);
        return $result;
    }

    public function getContentCount(string $tableName)
    {
        $query = "SELECT COUNT(*) FROM $tableName;";
        $req = $this->DBConn->prepare($query);
        $req->execute();
        return $req->fetch(PDO::FETCH_NAMED)['COUNT(*)'];
    }

    protected function executeRequest($query): array
    {
        $response = array('result' => 'success');
        $req = $this->DBConn->prepare($query);
        try {
            $req->execute();
        } catch (Throwable $e) {
            $response['requesterror'] = $e;
            $response['result'] = 'failed';
        }
        $response['body'] = $req->fetchAll(PDO::FETCH_NAMED);
        $response['code'] = $req->errorCode();
        return $response;
    }
}
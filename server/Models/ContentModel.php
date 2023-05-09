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
        $updateQueryObject = new UpdateQueryBuilder();
        $updateQueryObject->
        update($tableName, [$this::ENTRY_TITLE, $this::ENTRY_CONTENT, $this::ENTRY_CATEGORIES], [$title, $content, $categories])->
        where([$this::ENTRY_NUMBER, '=', $contentNumber]);
        return $this->executeRequest($updateQueryObject->getQuery());
    }

    public function deleteContent(string $tableName, int $contentNumber): array
    {
        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_NUMBER, '=', $contentNumber]);
        return $this->executeRequest($deleteQueryObject->getQuery());
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
        $selectQueryObject = new SelectQueryBuilder();
        //TODO: Is ; necessary for sql requests?
        $selectQueryObject->select(["LAST_INSERT_ID();"]);
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        //Should request LAST_INSERT_ID();
        return $request->fetch(PDO::FETCH_NAMED);
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
        foreach ($result['body'] as $resultBody) {
            $resultBody['CONTENT'] = mb_strimwidth($resultBody['CONTENT'], 0, $this::SHORT_DESC_LENGTH, "...");
        }
        $result['contentCount'] = $this->getContentCount($tableName);
        return $result;
    }

    public function getContentCount(string $tableName)
    {
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(["COUNT(*)"])->
        from($tableName);
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return $request->fetch(PDO::FETCH_NAMED)['COUNT(*)'];
    }

    protected function executeRequest($query): array
    {
        $response = array('result' => 'success');
        $request = $this->DBConn->prepare($query);
        try {
            $request->execute();
        } catch (Throwable $e) {
            $response['requesterror'] = $e;
            $response['result'] = 'failed';
        }
        $response['body'] = $request->fetchAll(PDO::FETCH_NAMED);
        $response['code'] = $request->errorCode();
        return $response;
    }
}
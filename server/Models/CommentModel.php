<?php

namespace Server;

use PDO;

class CommentModel extends BaseModel
{
    static private array $tablesForCategories = [
        "asset" => "ASSETS_COMMENTS",
        "article" => "ARTICLES_COMMENTS",
        "script" => "SCRIPTS_COMMENTS"
    ];

    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_CONTENT = 'CONTENT';
    private const ENTRY_PARENTNUMBER = 'PARENTNUMBER';
    private const ENTRY_CREATION_DATE = 'CREATION_DATE';
    private const ENTRY_ID = 'NUMBER';

    public function addComment(string $category, string $email, string $content, int $parentNumber): array
    {
        $tableName = self::$tablesForCategories[$category];
        $content = urlencode($content);

        $insertQueryObject = new InsertQueryBuilder();
        $insertQueryObject->
        insert($tableName, [$this::ENTRY_EMAIL, $this::ENTRY_CONTENT, $this::ENTRY_PARENTNUMBER], [$email, $content, $parentNumber]);

        $this->executeRequest($insertQueryObject->getQuery());

        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->select(["LAST_INSERT_ID()"]);

        $response = $this->executeRequest($selectQueryObject->getQuery());

        $lastCommentID = $response['body'][0]['LAST_INSERT_ID()'];
        $comment = $this->getComment($category, $lastCommentID);
        return $comment;
    }

    public function getComment(string $category, int $commentNumber): array
    {
        $tableName = self::$tablesForCategories[$category];

        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select([$this::ENTRY_EMAIL, $this::ENTRY_CONTENT, $this::ENTRY_CREATION_DATE, $this::ENTRY_ID])->
        from($tableName)->
        where([$this::ENTRY_ID, '=', $commentNumber])->
        orderBy($this::ENTRY_CREATION_DATE);

        $response = $this->executeRequest($selectQueryObject->getQuery());

        $response['body'][0]['CONTENT'] = urldecode($response['body'][0]['CONTENT']);
        return $response;
    }

    public function getComments(string $category, int $parentNumber): array
    {
        $tableName = self::$tablesForCategories[$category];

        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select([$this::ENTRY_EMAIL, $this::ENTRY_CONTENT, $this::ENTRY_CREATION_DATE, $this::ENTRY_ID])->
        from($tableName)->
        where([$this::ENTRY_PARENTNUMBER, '=', $parentNumber])->
        orderBy($this::ENTRY_CREATION_DATE);

        $response = $this->executeRequest($selectQueryObject->getQuery());

        foreach ($response['body'] as &$commentData) {
            $commentData['CONTENT'] = urldecode($commentData['CONTENT']);
        }
        return $response;
    }

    public function getCommentCount(string $category, int $parentNumber): int
    {
        $tableName = self::$tablesForCategories[$category];

        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(["COUNT(*)"])->
        from($tableName)->
        where([$this::ENTRY_PARENTNUMBER, '=', $parentNumber]);

        $response = $this->executeRequest($selectQueryObject->getQuery());
        return $response['body'][0]['COUNT(*)'];
    }

    public function deleteComment(string $category, int $commentID)
    {
        $tableName = self::$tablesForCategories[$category];

        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_ID, '=', $commentID]);

        $this->executeRequest($deleteQueryObject->getQuery());
    }

    public function deleteCommentsFromContent(string $category, int $contentID)
    {
        $tableName = self::$tablesForCategories[$category];

        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_PARENTNUMBER, '=', $contentID]);

        $this->executeRequest($deleteQueryObject->getQuery());
    }
}
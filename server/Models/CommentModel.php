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

    public function addComment(string $category, string $email, string $content, int $parentNumber): string
    {
        $tableName = self::$tablesForCategories[$category];
        $content = urlencode($content);

        $insertQueryObject = new InsertQueryBuilder();
        $insertQueryObject->
        insert($tableName, [$this::ENTRY_EMAIL, $this::ENTRY_CONTENT, $this::ENTRY_PARENTNUMBER], [$email, $content, $parentNumber]);
        $request = $this->DBConn->prepare($insertQueryObject->getQuery());
        $request->execute();
        return $request->errorCode() == '00000' ? 'success' : 'failure';
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

        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        $response = $request->fetchAll(PDO::FETCH_NAMED);
        foreach ($response as &$commentData) {
            $commentData['CONTENT'] = urldecode($commentData['CONTENT']);
        }
        return $response;
    }

    public function getCommentCount(string $category, int $parentNumber)
    {
        $tableName = self::$tablesForCategories[$category];

        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(["COUNT(*)"])->
        from($tableName)->
        where([$this::ENTRY_PARENTNUMBER, '=', $parentNumber]);

        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return $request->fetch()[0];
    }

    public function deleteComment(string $category, int $commentID)
    {
        $tableName = self::$tablesForCategories[$category];

        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_ID, '=', $commentID]);

        $request = $this->DBConn->prepare($deleteQueryObject->getQuery());
        $request->execute();
    }

    public function deleteCommentsFromContent(string $category, int $contentID)
    {
        $tableName = self::$tablesForCategories[$category];

        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_PARENTNUMBER, '=', $contentID]);

        $request = $this->DBConn->prepare($deleteQueryObject->getQuery());
        $request->execute();
    }
}
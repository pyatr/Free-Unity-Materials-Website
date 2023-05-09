<?php

namespace Server;

use PDO;

class CommentModel extends BaseModel
{
    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_CONTENT = 'CONTENT';
    private const ENTRY_PARENTNUMBER = 'PARENTNUMBER';
    private const ENTRY_CREATION_DATE = 'CREATION_DATE';

    public function addComment($email, $content, $parentNumber, $tableName): string
    {
        $content = urlencode($content);
        $insertQueryObject = new InsertQueryBuilder();
        $insertQueryObject->
        insert($tableName, [$this::ENTRY_EMAIL, $this::ENTRY_CONTENT, $this::ENTRY_PARENTNUMBER], [$email, $content, $parentNumber]);
        $request = $this->DBConn->prepare($insertQueryObject->getQuery());
        $request->execute();
        return $request->errorCode() == '00000' ? 'success' : 'failure';
    }

    public function getComments($parentNumber, $tableName): array
    {
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select([$this::ENTRY_EMAIL, $this::ENTRY_CONTENT, $this::ENTRY_CREATION_DATE])->
        from($tableName)->
        where([$this::ENTRY_PARENTNUMBER, '=', $parentNumber])->
        orderBy($this::ENTRY_CREATION_DATE);

        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return $request->fetchAll(PDO::FETCH_NAMED);
    }

    public function getCommentCount($parentNumber, $tableName): int
    {
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(["COUNT(*)"])->
        from($tableName)->
        where([$this::ENTRY_PARENTNUMBER, '=', $parentNumber]);

        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return $request->fetch()[0];
    }
}
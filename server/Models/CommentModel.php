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
        $query = "INSERT INTO $tableName (" . $this::ENTRY_EMAIL . ',' . $this::ENTRY_CONTENT . ',' . $this::ENTRY_PARENTNUMBER . ") VALUES ('$email', '$content', '$parentNumber');";
        $request = $this->DBConn->prepare($query);
        $request->execute();
        return $request->errorCode() == '00000' ? 'success' : 'failure';
    }

    public function getComments($parentNumber, $tableName): array
    {
        $query = "SELECT " . $this::ENTRY_EMAIL . ',' . $this::ENTRY_CONTENT . ',' . $this::ENTRY_CREATION_DATE . " FROM $tableName WHERE " . $this::ENTRY_PARENTNUMBER . "=$parentNumber ORDER BY " . $this::ENTRY_CREATION_DATE . " ASC;";
        $request = $this->DBConn->prepare($query);
        $request->execute();
        return $request->fetchAll(PDO::FETCH_NAMED);
    }

    public function getCommentCount($parentNumber, $tableName): int
    {
        $query = "SELECT COUNT(*) FROM $tableName WHERE " . $this::ENTRY_PARENTNUMBER . "=$parentNumber;";
        $req = $this->DBConn->prepare($query);
        $req->execute();
        return $req->fetch()[0];
    }
}
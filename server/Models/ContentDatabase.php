<?php

class ContentDatabase extends Database
{
    private const TABLE_POSTS = "POSTS";

    private const ENTRY_NUMBER = "NUMBER";
    private const ENTRY_TITLE = "TITLE";
    private const ENTRY_SHORTTITLE = "SHORTTITLE";
    private const ENTRY_CONTENT = "CONTENT";
    private const ENTRY_CATEGORIES = "CATEGORIES";
    private const ENTRY_CREDATE = "CREATION_DATE";

    public function createPost(string $title, string $shortTitle, string $content, string $categories): array
    {
        $query = "INSERT INTO " . $this::TABLE_POSTS . " (" . $this::ENTRY_TITLE . "," . $this::ENTRY_SHORTTITLE . "," . $this::ENTRY_CONTENT . "," . $this::ENTRY_CATEGORIES . ") VALUES('$title', '$shortTitle', '$content', '$categories')";
        return $this->executeRequest($query);
    }

    public function updatePost(int $number, string $title, string $shortTitle, string $content, string $categories): array
    {
        $query = "UPDATE " . $this::TABLE_POSTS . " SET "
            . $this::ENTRY_TITLE . "='$title',"
            . $this::ENTRY_SHORTTITLE . "='$shortTitle',"
            . $this::ENTRY_CONTENT . "='$content',"
            . $this::ENTRY_CATEGORIES . "='$categories' WHERE " . $this::ENTRY_NUMBER . " = '$number'";
        return $this->executeRequest($query);
    }

    public function executeRequest($query): array
    {
        $response = array("result" => "success");
        $req = $this->DBConn->prepare($query);
        try {
            $req->execute();
        } catch (Throwable $e) {
            $response["requesterror"] = $e;
            $response["result"] = "failed";
        }
        $response["content"] = $req->fetchAll(PDO::FETCH_NAMED);
        $response["code"] = $req->errorCode();
        return $response;
    }

    public function getPost(int $number): array
    {
        $query = "SELECT * FROM " . $this::TABLE_POSTS . " WHERE NUMBER = " . "'$number'";
        return $this->executeRequest($query);
    }

    public function getPosts(int $pageSize, int $page): array
    {
        $postsOffset = $pageSize * ($page - 1);
        $query = "SELECT " . $this::ENTRY_NUMBER . ","
            . $this::ENTRY_TITLE . ","
            . $this::ENTRY_SHORTTITLE . ","
            . $this::ENTRY_CATEGORIES . ","
            . $this::ENTRY_CREDATE . " FROM " . $this::TABLE_POSTS . " ORDER BY 1 DESC LIMIT $pageSize OFFSET $postsOffset";
        return $this->executeRequest($query);
    }

    public function deletePost(int $number): array
    {
        $query = "DELETE FROM " . $this::TABLE_POSTS . " WHERE " . $this::ENTRY_NUMBER . " = '$number'";
        return $this->executeRequest($query);
    }
}
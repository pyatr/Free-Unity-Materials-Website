<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 */
class Comment extends Model
{
    use HasFactory;

    protected $table = 'POSTS_COMMENTS';
    protected $primaryKey = 'ID';
    const CREATED_AT = 'CREATION_DATE';

    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_CONTENT = 'CONTENT';
    private const ENTRY_PARENT_ID = 'PARENT_ID';
    private const ENTRY_CREATION_DATE = 'CREATION_DATE';
    private const ENTRY_ID = 'ID';

    public static function addComment(string $category, string $email, string $content, int $parentNumber): array
    {
        /*
        $tableName = self::$tablesForCategories[$category];
        $email = urlencode($email);
        $content = urlencode($content);

        $insertQueryObject = new InsertQueryBuilder();
        $insertQueryObject->
        insert($tableName, [$this::ENTRY_EMAIL, $this::ENTRY_CONTENT, $this::ENTRY_PARENT_ID], [$email, $content, $parentNumber]);

        $this->executeRequest($insertQueryObject->getQuery());

        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->select(["LAST_INSERT_ID()"]);

        $response = $this->executeRequest($selectQueryObject->getQuery());

        $lastCommentID = $response['body'][0]['LAST_INSERT_ID()'];
        return $this->getComment($category, $lastCommentID);
        */
        return [];
    }

    public static function updateComment(string $category, string $content, int $commentNumber): array
    {
        /*
        $tableName = self::$tablesForCategories[$category];
        $content = urlencode($content);

        $updateQueryObject = new UpdateQueryBuilder();
        $updateQueryObject->
        update($tableName, [$this::ENTRY_CONTENT], [$content])->
        where([$this::ENTRY_ID, '=', $commentNumber]);

        $this->executeRequest($updateQueryObject->getQuery());

        return $this->getComment($category, $commentNumber);*/
        return [];
    }

    public static function getComment(int $commentID): array
    {
        $conditions = [[self::ENTRY_ID, '=', $commentID]];
        return self::getCommentsWithConditions($conditions);
    }

    public static function getComments(int $parentID): array
    {
        $conditions = [[self::ENTRY_PARENT_ID, '=', $parentID]];
        return self::getCommentsWithConditions($conditions);
    }

    private static function getCommentsWithConditions(array $conditions): array
    {
        $requestResult = Comment::where($conditions)->
        orderBy(self::ENTRY_CREATION_DATE)->
        get([self::ENTRY_EMAIL, self::ENTRY_CONTENT, self::ENTRY_CREATION_DATE, self::ENTRY_ID])->
        toArray();
        foreach ($requestResult as &$comment) {
            $comment[self::ENTRY_EMAIL] = urldecode($comment[self::ENTRY_EMAIL]);
            $comment[self::ENTRY_CONTENT] = urldecode($comment[self::ENTRY_CONTENT]);
        }
        return $requestResult;
    }

    public static function getCommentCount(int $parentID): int
    {
        $conditions = [[self::ENTRY_PARENT_ID, '=', $parentID]];

        return Comment::where($conditions)->
        orderBy(self::ENTRY_CREATION_DATE)->
        get([self::ENTRY_EMAIL, self::ENTRY_CONTENT, self::ENTRY_CREATION_DATE, self::ENTRY_ID])->count();
    }

    public static function deleteComment(string $category, int $commentID)
    {
        /*
        $tableName = self::$tablesForCategories[$category];

        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_ID, '=', $commentID]);

        $this->executeRequest($deleteQueryObject->getQuery());*/
        return [];
    }

    public static function deleteCommentsFromContent(string $category, int $contentID)
    {
        /*
        $tableName = self::$tablesForCategories[$category];

        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_PARENT_ID, '=', $contentID]);

        $this->executeRequest($deleteQueryObject->getQuery());*/
        return [];
    }
}
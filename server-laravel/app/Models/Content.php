<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Ramsey\Collection\Collection;

/**
 * @mixin Builder
 */
class Content extends Model
{
    use HasFactory;

    protected $table = 'POSTS';
    protected $primaryKey = 'ID';
    const CREATED_AT = 'CREATION_DATE';

    protected const ENTRY_TITLE = 'TITLE';
    protected const ENTRY_CONTENT = 'CONTENT';
    protected const ENTRY_CATEGORIES = 'CATEGORIES';
    protected const ENTRY_MAIN_CATEGORY = 'MAIN_CATEGORY';

    protected const SHORT_DESC_LENGTH = 128;

    public static function createContent(string $category, string $title, string $content, string $categories): array
    {
        /*
        $tableName = self::$tablesForCategories[$category];
        $title = urlencode($title);
        $content = urlencode($content);

        $selectQueryObject = new InsertQueryBuilder();
        $selectQueryObject->
        insert($tableName, [$this::ENTRY_TITLE, $this::ENTRY_CONTENT, $this::ENTRY_CATEGORIES], [$title, $content, $categories]);
        return $this->executeRequest($selectQueryObject->getQuery());
        */
        return [];
    }

    public static function updateContent(string $category, int $contentID, string $title, string $content, string $categories): array
    {
        /*
        $tableName = self::$tablesForCategories[$category];
        $title = urlencode($title);
        $content = urlencode($content);

        $updateQueryObject = new UpdateQueryBuilder();
        $updateQueryObject->
        update($tableName, [$this::ENTRY_TITLE, $this::ENTRY_CONTENT, $this::ENTRY_CATEGORIES], [$title, $content, $categories])->
        where([$this::ENTRY_NUMBER, '=', $contentID]);
        return $this->executeRequest($updateQueryObject->getQuery());
        */
        return [];
    }

    public static function deleteContent(string $category, int $contentID): array
    {
        /*
        $tableName = self::$tablesForCategories[$category];
        $commentModel = new CommentModel();
        $commentModel->deleteCommentsFromContent($category, $contentID);

        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($tableName)->
        where([$this::ENTRY_NUMBER, '=', $contentID]);
        return $this->executeRequest($deleteQueryObject->getQuery());
        */
        return [];
    }

    public static function getContent(string $category, int $contentID): array
    {
        $conditions = [['ID', '=', $contentID]];
        if ($category != '') {
            $conditions[] = [self::ENTRY_MAIN_CATEGORY, '=', $category];
        }
        $requestResult = Content::where($conditions)->get()->toArray();
        if (count($requestResult) > 0) {
            $requestResult[0]['TITLE'] = urldecode($requestResult[0]['TITLE']);
            $requestResult[0]['CONTENT'] = urldecode($requestResult[0]['CONTENT']);
            //$requestResult[0]['last_id'] = Content::getLastPostID();
        }
        return $requestResult;
    }

    public static function getContentPreviews(string $category, string $nameFilter, int $pageSize, int $page): array
    {
        $postsOffset = $pageSize * ($page - 1);
        $conditions = [];
        if ($category != '') {
            $conditions[] = [self::ENTRY_MAIN_CATEGORY, '=', $category];
        }
        if ($nameFilter != '') {
            $conditions[] = [self::ENTRY_TITLE, 'LIKE', "%$nameFilter%"];
        }
        $requestResult = Content::where($conditions)->
        orderBy(self::CREATED_AT, 'DESC')->
        take($pageSize)->
        offset($postsOffset)->
        get(['ID', self::ENTRY_TITLE, self::ENTRY_CATEGORIES, self::ENTRY_CONTENT, self::ENTRY_MAIN_CATEGORY]);

        foreach ($requestResult as &$requestResultUnit) {
            $requestResultUnit[self::ENTRY_TITLE] = urldecode($requestResultUnit[self::ENTRY_TITLE]);
            $requestResultUnit[self::ENTRY_CONTENT] = mb_strimwidth(
                urldecode($requestResultUnit[self::ENTRY_CONTENT]),
                0,
                self::SHORT_DESC_LENGTH,
                "..."
            );
        }
        $posts['posts'] = $requestResult;
        $posts['contentCount'] = Content::where($conditions)->count();
        return $posts;
    }

    public static function getLastPostID(): int
    {
        return DB::getPdo()->lastInsertID();
    }
}

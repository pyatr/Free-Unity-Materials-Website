<?php

namespace Server;

use PDO;

class UserModel extends BaseModel
{
    private const TABLE_USERS = 'USERS';

    private const ROLE_EDITOR = 'EDITOR';
    private const ROLE_ADMIN = 'ADMIN';
    private const ROLE_USER = 'USER';

    private const ENTRY_USERNAME = 'USERNAME';
    private const ENTRY_PASSWORD = 'PASSWORD';
    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_STATUS = 'STATUS';

    public function doesUserExist(string $key): bool
    {
        return $this->DBConn->query("SELECT COUNT(1) FROM " . $this::TABLE_USERS . " WHERE unique_key = $key") > 0;
    }

    //How to change username: UPDATE USERS SET USERNAME = 'newname' WHERE USERNAME = 'oldname';

    public function getUserAttribute(string $email, string $attribute): string
    {
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select([$attribute])->
        from($this::TABLE_USERS)->
        where([$this::ENTRY_EMAIL, '=', $email]);
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return $request->fetch(PDO::FETCH_NAMED)[$attribute];
    }

    public function getUserName(string $email): string
    {
        return $this->getUserAttribute($email, $this::ENTRY_USERNAME);
    }

    public function getUserRole(string $email): string
    {
        return $this->getUserAttribute($email, $this::ENTRY_STATUS);
    }

    public function createNewUser(string $newName, string $password, string $email): void
    {
        if (!$this->doesUserExist($email)) {
            $hashedPassword = hash(BaseModel::HASHING_ALGORITHM, $password);
            $insertQueryObject = new InsertQueryBuilder();
            $insertQueryObject->
            insert($this::TABLE_USERS, [$this::ENTRY_USERNAME, $this::ENTRY_PASSWORD, $this::ENTRY_EMAIL, $this::ENTRY_STATUS], [$newName, $hashedPassword, $email, $this::ROLE_USER]);
            $this->DBConn->query($insertQueryObject->getQuery());
        }
    }
}
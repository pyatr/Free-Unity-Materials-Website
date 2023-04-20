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
    private const ENTRY_ROLE = 'ROLE';


    private function getUserTableColumns(): string
    {
        return '(`' . UserModel::ENTRY_USERNAME .
            '`, `' . UserModel::ENTRY_PASSWORD .
            '`, `' . UserModel::ENTRY_EMAIL .
            '`, `' . UserModel::ENTRY_ROLE . '`)';
    }

    public function doesUserExist(
        string $key
    ): bool {
        return $this->DBConn->query(
                "SELECT COUNT(1) FROM " . $this::TABLE_USERS . " WHERE unique_key = $key"
            ) > 0;
    }

    //How to change username: UPDATE USERS SET USERNAME = 'newname' WHERE USERNAME = 'oldname';

    public function getUserName(string $email): string
    {
        $query = "SELECT * FROM " . $this::TABLE_USERS . " WHERE " . $this::ENTRY_EMAIL . " = '$email'";
        $req = $this->DBConn->prepare($query);
        $req->execute();
        return $req->fetch()['USERNAME'];
    }

    public function createNewUser(
        string $newName,
        string $password,
        string $email
    ): void {
        if (!$this->doesUserExist($email)) {
            $hashedPassword = hash(BaseModel::HASHING_ALGORITHM, $password);
            $this->performQuery();
            $this->DBConn->query(
                "INSERT INTO " . UserModel::TABLE_USERS . " {$this::getUserTableColumns()} VALUES ('$newName', '$hashedPassword', '$email', '" . UserModel::ROLE_USER . "');"
            );
        }
    }
}
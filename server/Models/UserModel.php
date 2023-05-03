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


    private function getUserTableColumns(): string
    {
        return '(`' . UserModel::ENTRY_USERNAME .
            '`, `' . UserModel::ENTRY_PASSWORD .
            '`, `' . UserModel::ENTRY_EMAIL .
            '`, `' . UserModel::ENTRY_STATUS . '`)';
    }

    public function doesUserExist(string $key): bool
    {
        return $this->DBConn->query("SELECT COUNT(1) FROM " . $this::TABLE_USERS . " WHERE unique_key = $key") > 0;
    }

    //How to change username: UPDATE USERS SET USERNAME = 'newname' WHERE USERNAME = 'oldname';

    public function getUserParam(string $email, string $param): string
    {
        $query = "SELECT $param FROM " . $this::TABLE_USERS . " WHERE " . $this::ENTRY_EMAIL . " = '$email'";
        $req = $this->DBConn->prepare($query);
        $req->execute();
        return $req->fetch(PDO::FETCH_NAMED)[$param];
    }

    public function getUserName(string $email): string
    {
        return $this->getUserParam($email, $this::ENTRY_USERNAME);
    }

    public function getUserRole(string $email): string
    {
        return $this->getUserParam($email, $this::ENTRY_STATUS);
    }

    public function createNewUser(string $newName, string $password, string $email): void
    {
        if (!$this->doesUserExist($email)) {
            $hashedPassword = hash(BaseModel::HASHING_ALGORITHM, $password);
            $this->performQuery();
            $this->DBConn->query(
                "INSERT INTO " . UserModel::TABLE_USERS . " {$this::getUserTableColumns()} VALUES ('$newName', '$hashedPassword', '$email', '" . UserModel::ROLE_USER . "');"
            );
        }
    }
}
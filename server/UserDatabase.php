<?php

class UserDatabase extends Database
{
    private const TABLE_USERS = "USERS";

    private const ROLE_EDITOR = "EDITOR";
    private const ROLE_ADMIN = "ADMIN";
    private const ROLE_USER = "USER";

    private const ENTRY_USERNAME = "USERNAME";
    private const ENTRY_PASSWORD = "PASSWORD";
    private const ENTRY_EMAIL = "EMAIL";
    private const ENTRY_ROLE = "ROLE";


    private function getUserTableColumns(): string
    {
        return "(`" . UserDatabase::ENTRY_USERNAME .
            "`, `" . UserDatabase::ENTRY_PASSWORD .
            "`, `" . UserDatabase::ENTRY_EMAIL .
            "`, `" . UserDatabase::ENTRY_ROLE . "`)";
    }

    public function doesUserExist(
        string $key
    ): bool {
        return $this->DBConn->query(
                "SELECT COUNT(1) FROM " . $this::TABLE_USERS . " WHERE unique_key = $key"
            ) > 0;
    }

    public function createNewUser(
        string $newName,
        string $password,
        string $email
    ): void {
        if (!$this->doesUserExist($email)) {
            $hashedPassword = hash(Database::HASHING_ALGORITHM, $password);
            $this->performQuery();
            $this->DBConn->query(
                "INSERT INTO " . UserDatabase::TABLE_USERS . " {$this::getUserTableColumns()} VALUES ('$newName', '$hashedPassword', '$email', '" . UserDatabase::ROLE_USER . "');"
            );
        }
    }
}
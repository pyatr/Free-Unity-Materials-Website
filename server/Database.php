<?php

class Database
{
    private const HOST_NAME = "FUM-database-service";
    private const DATABASE_NAME = "PrimaryDatabase";

    private const TABLE_USERS = "USERS";
    private const TABLE_POSTS = "POSTS";

    private const ROLE_EDITOR = "EDITOR";
    private const ROLE_ADMIN = "ADMIN";
    private const ROLE_USER = "USER";

    private const ENTRY_USERNAME = "USERNAME";
    private const ENTRY_PASSWORD = "PASSWORD";
    private const ENTRY_EMAIL = "EMAIL";
    private const ENTRY_ROLE = "ROLE";

    private const HASHING_ALGORITHM = "md5";

    private PDO $DBConn;

    function __construct()
    {
        $this->connect();
    }

    function __destruct()
    {
        //$this->DBConn = null;
    }

    function connect(): void
    {
        $this->DBConn = new PDO(
            "mysql:host=" . $this::HOST_NAME . ";dbname=" . Database::DATABASE_NAME,
            "admin",
            "admin"
        );
    }

    public function tryLogin(string $email, string $password): bool
    {
        return $this->DBConn->query(
                "SELECT COUNT(1) FROM " . $this::TABLE_USERS . " WHERE " . $this::ENTRY_EMAIL . " = $email AND " . $this::ENTRY_PASSWORD . " = $password"
            ) > 0;
    }

    public function elementWithParametersExists(string $tableName, $parameters, $values): bool
    {
        if (!$parameters . is_array() || !$values . is_array()) {
            return false;
        }
        $paramCount = $parameters . count();
        $valuesCount = $values . count();
        if ($paramCount != $valuesCount || $paramCount == 0 || $valuesCount == 0) {
            return false;
        }
        $query = "SELECT COUNT(1) FROM $tableName WHERE $parameters[0] = $values[0]";
        for ($i = 1; $i < $paramCount; $i++) {
            $query += " AND $parameters[i] = $values[i]";
        }
        return $this->DBConn->query($query) > 0;
    }

    private
    function getUserTableColumns(): string
    {
        return "(`" . Database::ENTRY_USERNAME .
            "`, `" . Database::ENTRY_PASSWORD .
            "`, `" . Database::ENTRY_EMAIL .
            "`, `" . Database::ENTRY_ROLE . "`)";
    }

    public
    function doesUserExist(
        string $key
    ): bool {
        return $this->DBConn->query(
                "SELECT COUNT(1) FROM " . $this::TABLE_USERS . " WHERE unique_key = $key"
            ) > 0;
    }

    public
    function createNewUser(
        string $newName,
        string $password,
        string $email
    ): void {
        if (!$this->doesUserExist($email)) {
            $hashedPassword = hash($this::HASHING_ALGORITHM, $password);
            $this->performQuery();
            $this->DBConn->query(
                "INSERT INTO " . Database::TABLE_USERS . " {$this::getUserTableColumns()} VALUES ($newName, $hashedPassword, $email, " . $this::ROLE_USER . ");"
            );
        }
    }
}

//🐘🐘🐘
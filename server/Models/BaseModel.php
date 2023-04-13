<?php

namespace Server;

use PDO;

class BaseModel
{
    protected const HOST_NAME = "fum-db";
    protected const DATABASE_NAME = "PrimaryDatabase";

    protected const HASHING_ALGORITHM = "md5";

    protected PDO $DBConn;

    public function __construct()
    {
        $this->connect();
    }

    private function connect(): void
    {
        $this->DBConn = new PDO(
            "mysql:host=" . $this::HOST_NAME . ";dbname=" . BaseModel::DATABASE_NAME,
            "admin",
            "admin"
        );
    }

    public function elementWithParametersExists(
        string $tableName,
        $parameters,
        $values
    ): bool {
        if (!is_array($parameters) || !is_array($values)) {
            return false;
        }
        $paramCount = count($parameters);
        $valuesCount = count($values);
        if ($paramCount != $valuesCount || $paramCount == 0 || $valuesCount == 0) {
            return false;
        }
        $query = "SELECT COUNT(1) FROM $tableName WHERE $parameters[0] = '$values[0]'";
        for ($i = 1; $i < $paramCount; $i++) {
            $query = $query . " AND $parameters[$i] = '$values[$i]'";
        }

        $result = $this->DBConn->query($query);
        return (int)$result->fetchColumn() > 0;
    }
}
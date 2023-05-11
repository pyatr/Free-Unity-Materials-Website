<?php

namespace Server;

use PDO;

abstract class BaseModel
{
    protected const HOST_NAME = 'fum-db';
    protected const DATABASE_NAME = 'PrimaryDatabase';

    protected const HASHING_ALGORITHM = 'md5';

    protected PDO $DBConn;

    public function __construct()
    {
        $this->connect();
    }

    private function connect(): void
    {
        $this->DBConn = new PDO(
            'mysql:host=' . $this::HOST_NAME . ';dbname=' . BaseModel::DATABASE_NAME,
            'admin',
            'admin'
        );
    }

    public function elementWithAttributeValuesExists(string $tableName, array $attributes, array $values): bool
    {
        $attributeCount = count($attributes);
        $valuesCount = count($values);
        if ($attributeCount != $valuesCount || $attributeCount == 0 || $valuesCount == 0) {
            return false;
        }
        //TODO: Add multiple WHERE support for QueryBuilders and rewrite this
        $query = "SELECT COUNT(1) FROM $tableName WHERE $attributes[0] = '$values[0]'";
        for ($i = 1; $i < $attributeCount; $i++) {
            $query = $query . " AND $attributes[$i] = '$values[$i]'";
        }

        $result = $this->DBConn->query($query);
        return (int)$result->fetchColumn() > 0;
    }

    protected function executeRequest($query): array
    {
        $response = array('result' => 'success');
        $request = $this->DBConn->prepare($query);
        try {
            $request->execute();
        } catch (Throwable $e) {
            $response['requesterror'] = $e;
            $response['result'] = 'failed';
        }
        $response['body'] = $request->fetchAll(PDO::FETCH_NAMED);
        $response['code'] = $request->errorCode();
        return $response;
    }
}
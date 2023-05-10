<?php

namespace Server;

class InsertQueryBuilder extends AbstractQueryBuilder
{
    private string $insert = '';

    public function insert(string $table, array $columnNames, array $values)
    {
        $columnsAsString = implode(', ', $columnNames);
        foreach ($values as &$value) {
            $value = "'$value'";
        }
        $valuesAsString = implode(', ', $values);
        $this->insert = "INSERT INTO $table ($columnsAsString) VALUES($valuesAsString)";
        return $this;
    }

    protected function getRequestParts(): array
    {
        return [$this->insert];
    }
}
<?php

namespace Server;

class InsertQueryBuilder extends AbstractQueryBuilder
{
    private string $insert = '';

    public function insert(string $table, array $columnNames, array $values)
    {
        $columnsAsString = implode(', ', $columnNames);
        for ($i = 0; $i < count($values); $i++) {
            $values[$i] = "'$values[$i]'";
        }
        $valuesAsString = implode(', ', $values);
        $this->insert = "INSERT INTO $table ($columnsAsString) VALUES($valuesAsString)";
        return $this;
    }
}
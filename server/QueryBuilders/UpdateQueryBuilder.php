<?php

namespace Server;

class UpdateQueryBuilder extends AbstractQueryBuilder
{
    private string $update = '';

    public function update(string $table, array $columnNames, array $values)
    {
        for ($i = 0; $i < count($values); $i++) {
            $columnNames[$i] = "$columnNames[$i]='$values[$i]'";
        }
        $columnsAsString = implode(', ', $columnNames);
        $this->update = "UPDATE $table SET $columnsAsString";
        return $this;
    }

    protected function getRequestParts(): array
    {
        return [$this->update, $this->where];
    }
}
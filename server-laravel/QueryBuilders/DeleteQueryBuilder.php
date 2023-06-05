<?php

namespace Server;

class DeleteQueryBuilder extends AbstractQueryBuilder
{
    private string $delete = '';


    public function delete(string $tableName)
    {
        $this->delete = "DELETE FROM $tableName";
        return $this;
    }

    protected function getRequestParts(): array
    {
        return [$this->delete, $this->where];
    }
}
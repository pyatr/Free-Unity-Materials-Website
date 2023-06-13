<?php

namespace Server;

class SelectQueryBuilder extends AbstractQueryBuilder
{
    private string $select = '';
    private string $from = '';
    private string $orderBy = '';
    private string $limit = '';

    private string $offset = '';

    public function select(array $fields)
    {
        if (count($fields) == 0) {
            $fieldsAsString = '*';
        } else {
            $fieldsAsString = implode(', ', $fields);
        }
        $this->select = "SELECT $fieldsAsString";
        return $this;
    }

    public function from(string $table)
    {
        $this->from = "FROM $table";
        return $this;
    }

    public function orderBy(string $field = '1', string $order = 'ASC')
    {
        //Order by 1 means ordering by first column
        $this->orderBy = "ORDER BY $field $order";
        return $this;
    }

    public function limit(int $limit = 1)
    {
        $this->limit = "LIMIT $limit";
        return $this;
    }

    public function offset(int $offset)
    {
        $this->offset = "OFFSET $offset";
        return $this;
    }

    protected function getRequestParts(): array
    {
        return [$this->select, $this->from, $this->where, $this->orderBy, $this->limit, $this->offset];
    }
}
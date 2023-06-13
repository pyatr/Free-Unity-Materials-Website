<?php

namespace Server;

abstract class AbstractQueryBuilder
{
    protected string $where = '';

    public function where(array $conditions)
    {
        $conditionsAsString = implode($conditions);
        $this->where = "WHERE $conditionsAsString";
        return $this;
    }

    abstract protected function getRequestParts(): array;

    public function getQuery(): string
    {
        $allRequestParts = $this->getRequestParts();
        $cleanRequest = [];
        foreach ($allRequestParts as $requestElement) {
            if ($requestElement != '') {
                array_push($cleanRequest, $requestElement);
            }
        }
        return implode(' ', $cleanRequest);
    }
}
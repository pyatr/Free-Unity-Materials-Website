<?php

namespace Server;

abstract class AbstractQueryBuilder
{
    public function getQuery(): string
    {
        $allRequestParts = (array)$this;
        $cleanRequest = [];
        foreach ($allRequestParts as $requestElement) {
            if ($requestElement != '') {
                array_push($cleanRequest, $requestElement);
            }
        }
        return implode(' ', $cleanRequest);
    }
}
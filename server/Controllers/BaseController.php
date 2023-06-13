<?php

namespace Server;

abstract class BaseController
{
    protected function tryGetValue(array $array, $key)
    {
        return (array_key_exists($key, $array)) ? $array[$key] : null;
    }
}
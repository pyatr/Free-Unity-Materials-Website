<?php

namespace Server;

class BaseController
{
    protected function tryGetValue($array, $key)
    {
        return (array_key_exists($key, $array)) ? $array[$key] : null;
    }
}
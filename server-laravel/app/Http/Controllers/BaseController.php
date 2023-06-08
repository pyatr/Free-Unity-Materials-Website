<?php

namespace App\Http\Controllers;

class BaseController extends Controller
{
    protected static function tryGetValue(array $array, $key)
    {
        return (array_key_exists($key, $array)) ? $array[$key] : null;
    }
}

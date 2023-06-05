<?php

namespace Server;

class CookieManager
{
    public static function getCookie(string $cookieName): string
    {
        $cookie = null;
        $cookies = explode('; ', $_SERVER['HTTP_COOKIE']);
        foreach ($cookies as $kvp) {
            $result = explode('=', $kvp);
            if (count($result) <= 1) {
                continue;
            }
            $stringEquality = strcmp($result[0], $cookieName);
            if ($stringEquality == 0) {
                //Decode to add special symbols back
                $cookie = urldecode($result[1]);
            }
        }
        return $cookie;
    }
}
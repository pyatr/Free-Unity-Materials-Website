<?php

namespace Server;

class SiteInfo
{
    public static function getHostInfo(): array
    {
        return FileManager::getTextFileContents(dirname($_SERVER['DOCUMENT_ROOT']) . '/hostdata');
    }

    public static function getServerInfo(): array
    {
        return FileManager::getTextFileContents(dirname($_SERVER['DOCUMENT_ROOT']) . '/serverdata');
    }

    public static function getSMTPinfo(): array
    {
        return FileManager::getTextFileContents($_SERVER['DOCUMENT_ROOT'] . '/smtpdata');
    }
}

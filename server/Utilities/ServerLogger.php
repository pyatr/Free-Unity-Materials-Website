<?php

namespace Server;

class ServerLogger
{
    public static function Log(string $message)
    {
        //Log folder and permissions have to be created manually
        $logFileFolder = 'Logs';
        $logFileName = date('d-m-y') . '_log.txt';
        $logFile = fopen($_SERVER['DOCUMENT_ROOT'] . "/$logFileFolder/$logFileName", 'w');
        if ($logFile) {
            fwrite($logFile, $message . '\n');
            fclose($logFile);
        }
    }
}
<?php

namespace Server;

class ServerLogger
{
    public static function Log(string $message)
    {
        //Log folder and permissions have to be created manually
        $logFileFolder = 'Logs';
        $logFileName = date('d-m-y') . '_log.txt';
        $logFilePath = $_SERVER['DOCUMENT_ROOT'] . "/$logFileFolder/$logFileName";
        $logFile = file_get_contents($logFilePath);
        $logFile .= "$message\r\n";
        file_put_contents($logFilePath, $logFile, FILE_APPEND);
    }
}
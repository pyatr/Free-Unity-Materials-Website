<?php

namespace Server;

class ServerLogger
{
    public static function Log($message): void
    {
        //Log folder and permissions have to be created manually
        $logFileFolder = 'Logs';
        $logFileName = date('d-m-y') . '_log.txt';
        $logFilePath = $_SERVER['DOCUMENT_ROOT'] . "/$logFileFolder/$logFileName";
        if (is_array($message)) {
            $message = implode('\r\n', $message);
        }
        file_put_contents($logFilePath, "$message\r\n", FILE_APPEND);
    }
}
<?php

namespace App\Utilities;

class ServerLogger
{
    public static function Log($message): void
    {
        $logFileFolder = dirname($_SERVER['DOCUMENT_ROOT'], 1) . "/storage/server-logs";
        $logFileName = date('d-m-y') . '_log.txt';
        if (!is_dir($logFileFolder)) {
            mkdir($logFileFolder, 0777, true);
        }
        $logFilePath = "$logFileFolder/$logFileName";
        if (is_array($message)) {
            $message = implode('\r\n', $message);
        }
        file_put_contents($logFilePath, "$message\r\n", FILE_APPEND);
    }
}

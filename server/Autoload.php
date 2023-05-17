<?php

spl_autoload_register(function ($className) {
    $namespaces = [
        'Server',
    ];
    $directories = [
        'Controllers',
        'Models',
        'Utilities',
        'QueryBuilders'
    ];

    //TODO: add multiple namespace support
    $mailerFileDirectory = __DIR__ . "\\PHPMailer\\src";
    $mailerFileDirectory = str_replace('\\', DIRECTORY_SEPARATOR, $mailerFileDirectory);
    if (file_exists($mailerFileDirectory)) {
        $scripts = glob("$mailerFileDirectory/*.php", GLOB_NOSORT);
        foreach ($scripts as $script) {
            include_once $script;
        }
    }

    $projectDir = __DIR__ . '\\';
    foreach ($namespaces as $namespace) {
        $prefix = "$namespace\\";
        $prefixLength = strlen($prefix);
        $cleanClassName = substr($className, $prefixLength);
        foreach ($directories as $classDirectory) {
            $file = $projectDir . $classDirectory . '\\' . $cleanClassName . '.php';
            $file = str_replace('\\', DIRECTORY_SEPARATOR, $file);
            if (file_exists($file)) {
                include_once $file;
            }
        }
    }
});
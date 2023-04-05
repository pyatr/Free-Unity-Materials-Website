<?php

spl_autoload_register(function ($className) {
    $directories = [
        "",
        "Controllers\\",
        "Models\\"
    ];
    foreach ($directories as $dir) {
        $file = __DIR__ . '\\' . $dir . $className . '.php';
        $file = str_replace('\\', DIRECTORY_SEPARATOR, $file);

        if (file_exists($file)) {
            include $file;
        }
    }
});
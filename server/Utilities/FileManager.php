<?php

namespace Server;

class FileManager
{
    //Delete folder with subfolders and files
    public static function DeleteFolder($dir)
    {
        if ($dir != "") {
            $files = array_diff(scandir($dir), array('.', '..'));

            foreach ($files as $file) {
                (is_dir("$dir/$file")) ? FileManager::DeleteFolder("$dir/$file") : unlink("$dir/$file");
            }

            return rmdir($dir);
        }
    }
}
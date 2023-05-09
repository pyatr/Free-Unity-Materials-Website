<?php

namespace Server;

class FileManager
{
    //Delete folder with subfolders and files
    public static function saveImages(array $gallery, string $folder, int $contentNumber)
    {
        if (count($gallery) == 0) {
            return;
        }
        $currentContentImageDirectory = __DIR__ . "/Images/$folder/$contentNumber";
        $galleryDirectory = "$currentContentImageDirectory/Gallery";

        mkdir($currentContentImageDirectory);
        mkdir($galleryDirectory);
        $fileNumber = 1;
        //Add guid to file name so that old cached version would not display after changes
        $guid = GUIDCreator::GUIDv4();
        foreach ($gallery as $image) {
            //Alternative name: $guid = GUIDCreator::GUIDv4();
            file_put_contents("$galleryDirectory/$fileNumber$guid.png", file_get_contents($image));
            $fileNumber++;
        }
    }

    public static function deleteAllImages(string $folder, int $contentNumber)
    {
        $galleryFolderName = __DIR__ . "/Images/$folder/$contentNumber";
        if (file_exists($galleryFolderName)) {
            FileManager::deleteFolder($galleryFolderName);
        }
    }

    public static function getImageLinks(string $folder, int $contentNumber): array
    {
        $links[0] = 'none';
        $galleryDirectory = "Images/$folder/$contentNumber/Gallery";
        if (is_dir(__DIR__ . "/$galleryDirectory/")) {
            $imagesInGallery = glob(__DIR__ . "/$galleryDirectory/*.png");
            $imagesCount = count($imagesInGallery);
            if ($imagesCount > 0) {
                for ($i = 0; $i < $imagesCount; $i++) {
                    $fileNameSplit = explode('/', $imagesInGallery[$i]);
                    $fileName = $fileNameSplit[count($fileNameSplit) - 1];
                    $links[$i] = "$galleryDirectory/" . $fileName;
                }
            }
        }
        return $links;
    }

    public static function saveFiles(array $files, int $contentNumber)
    {
        if (count($files) == 0) {
            return;
        }

        $currentContentFileDirectory = __DIR__ . "/FileStorage/Assets/$contentNumber";
        if (!is_dir($currentContentFileDirectory)) {
            mkdir($currentContentFileDirectory);
        }
        $existingFiles = scandir($currentContentFileDirectory);
        sort($existingFiles, SORT_NUMERIC);
        $fileCount = count($existingFiles);
        $fileNumber = 1;
        if ($fileCount - 2 > 0) {
            $lastFile = $existingFiles[$fileCount - 1];
            $fileNumber = $lastFile + 1;
        }

        foreach ($files as $file) {
            $fileAsArray = get_object_vars($file);
            $fileName = FileManager::tryGetValue($fileAsArray, 'fileName');
            $fileContent = FileManager::tryGetValue($fileAsArray, 'fileContent');
            if ($fileName == "") {
                $fileName = GUIDCreator::GUIDv4();
            }
            $fileName = str_replace(" ", "_", $fileName);
            //Putting files in folders, so they would be ordered in a way they were placed
            mkdir("$currentContentFileDirectory/$fileNumber");
            file_put_contents("$currentContentFileDirectory/$fileNumber/$fileName", file_get_contents($fileContent));
            $fileNumber++;
        }
    }

    public static function deleteFiles(array $fileNumbers, int $contentNumber)
    {
        if (count($fileNumbers) == 0) {
            return;
        }

        $currentContentFileDirectory = __DIR__ . "/FileStorage/Assets/$contentNumber";
        if (!is_dir($currentContentFileDirectory)) {
            return;
        }

        foreach ($fileNumbers as $fileNumber) {
            if (is_dir("$currentContentFileDirectory/$fileNumber")) {
                FileManager::deleteFolder("$currentContentFileDirectory/$fileNumber");
            }
        }
    }

    public static function getFileLinks(int $contentNumber): array
    {
        $links[0] = 'none';
        $currentContentFileDirectory = "FileStorage/Assets/$contentNumber";
        $fullFilePath = __DIR__ . "/$currentContentFileDirectory";
        if (is_dir($fullFilePath)) {
            $filesInContentDirectory = scandir($fullFilePath);
            $fileCount = count($filesInContentDirectory);
            if ($fileCount > 2) {
                sort($filesInContentDirectory, SORT_NUMERIC);
                for ($i = 2; $i < $fileCount; $i++) {
                    $fileName = scandir("$fullFilePath/$filesInContentDirectory[$i]")[2];
                    $links[$i - 2] = "$currentContentFileDirectory/$filesInContentDirectory[$i]/$fileName";
                }
            }
        }
        return $links;
    }

    public static function deleteFolder($dir)
    {
        if ($dir != "") {
            if (!file_exists($dir)) {
                return;
            }
            $files = array_diff(scandir($dir), array('.', '..'));

            foreach ($files as $file) {
                (is_dir("$dir/$file")) ? FileManager::deleteFolder("$dir/$file") : unlink("$dir/$file");
            }

            return rmdir($dir);
        }
    }

    protected static function tryGetValue(array $array, $key)
    {
        return (array_key_exists($key, $array)) ? $array[$key] : null;
    }
}
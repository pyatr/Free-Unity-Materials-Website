<?php

namespace Server;

class FileManager
{
    static private array $foldersForCategories = ["asset" => "Assets", "article" => "Articles", "script" => "Scripts"];

    public static function saveImages(array $gallery, string $category, int $contentID): void
    {
        if (count($gallery) == 0) {
            return;
        }

        $folder = self::$foldersForCategories[$category];
        $currentContentImageDirectory = $_SERVER['DOCUMENT_ROOT'] . "/Images/$folder/$contentID";
        $galleryDirectory = "$currentContentImageDirectory/Gallery";

        mkdir($currentContentImageDirectory);
        mkdir($galleryDirectory);
        $fileNumber = 1;
        //Add guid to file name so that old cached version would not display after changes
        $guid = GUIDCreator::GUIDv4();
        foreach ($gallery as $image) {
            file_put_contents("$galleryDirectory/$fileNumber-$guid.png", file_get_contents($image));
            $fileNumber++;
        }
    }

    public static function deleteAllImages(string $category, int $contentID): void
    {
        $folder = self::$foldersForCategories[$category];
        $galleryFolderName = $_SERVER['DOCUMENT_ROOT'] . "/Images/$folder/$contentID";
        self::deleteFolder($galleryFolderName);
    }

    public static function getImageLinks(string $category, int $contentID): array
    {
        $folder = self::$foldersForCategories[$category];
        $links = [];
        $galleryDirectory = "Images/$folder/$contentID/Gallery";
        if (is_dir($_SERVER['DOCUMENT_ROOT'] . "/$galleryDirectory/")) {
            $imagesInGallery = glob($_SERVER['DOCUMENT_ROOT'] . "/$galleryDirectory/*.png", GLOB_NOSORT);
            sort($imagesInGallery, SORT_NATURAL);
            foreach ($imagesInGallery as $image) {
                $fileNameSplit = explode('/', $image);
                $fileName = $fileNameSplit[count($fileNameSplit) - 1];
                $links[] = "$galleryDirectory/$fileName";
            }
        }
        if (count($links) == 0) {
            $links[0] = 'none';
        }
        return $links;
    }

    public static function loadImagesForPreviews(&$loadPreviewsResponse, $category): void
    {
        $folder = self::$foldersForCategories[$category];

        foreach ($loadPreviewsResponse['body'] as &$preview) {
            $contentID = $preview['NUMBER'];
            $galleryDirectory = "Images/$folder/$contentID/Gallery";
            if (is_dir($_SERVER['DOCUMENT_ROOT'] . "/$galleryDirectory/")) {
                $filesInDirectory = scandir($_SERVER['DOCUMENT_ROOT'] . "/$galleryDirectory/");
                if (count($filesInDirectory) > 2) {
                    $previewName = $filesInDirectory[2];
                    $preview['titlepicLink'] = "$galleryDirectory/$previewName";
                }
            } else {
                $preview['titlepicLink'] = "noimages";
            }
        }
    }

    public static function saveFiles(array $files, string $category, int $contentID): void
    {
        if (count($files) == 0) {
            return;
        }
        $folder = self::$foldersForCategories[$category];

        $currentContentFileDirectory = $_SERVER['DOCUMENT_ROOT'] . "/FileStorage/$folder/$contentID";
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
            $fileName = self::tryGetValue($fileAsArray, 'fileName');
            $fileContent = self::tryGetValue($fileAsArray, 'fileContent');
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

    public static function deleteFiles(array $fileNumbers, string $category, int $contentID): void
    {
        if (count($fileNumbers) == 0) {
            return;
        }

        $folder = self::$foldersForCategories[$category];
        $currentContentFileDirectory = $_SERVER['DOCUMENT_ROOT'] . "/FileStorage/$folder/$contentID";
        if (!is_dir($currentContentFileDirectory)) {
            return;
        }

        foreach ($fileNumbers as $fileNumber) {
            self::deleteFolder("$currentContentFileDirectory/$fileNumber");
        }
    }

    public static function getFileLinks(string $category, int $contentID): array
    {
        $folder = self::$foldersForCategories[$category];
        $links = [];
        $currentContentFileDirectory = "FileStorage/$folder/$contentID";
        $fullFilePath = $_SERVER['DOCUMENT_ROOT'] . "/$currentContentFileDirectory";
        if (is_dir($fullFilePath)) {
            $fileFoldersInContentDirectory = glob("$fullFilePath/*", GLOB_NOSORT);

            sort($fileFoldersInContentDirectory, SORT_NATURAL);
            foreach ($fileFoldersInContentDirectory as $fileFolder) {
                $fileName = scandir("$fileFolder")[2];
                $links[] = "$fileFolder/$fileName";
            }
        }
        if (count($links) == 0) {
            $links[0] = 'none';
        }
        return $links;
    }

    public static function deleteContentFiles(string $category, int $contentID): void
    {
        $folder = self::$foldersForCategories[$category];
        $imageFolder = $_SERVER['DOCUMENT_ROOT'] . "/Images/$folder/$contentID";
        $filesFolder = $_SERVER['DOCUMENT_ROOT'] . "/FileStorage/$folder/$contentID";

        FileManager::deleteFolder($imageFolder);
        FileManager::deleteFolder($filesFolder);
    }

    //Delete folder with subfolders and files
    public static function deleteFolder($dir)
    {
        if (!file_exists($dir)) {
            ServerLogger::Log("$dir does not exist, can not delete");
        } else {
            if ($dir != "") {
                $files = array_diff(scandir($dir), array('.', '..'));

                foreach ($files as $file) {
                    (is_dir("$dir/$file")) ? self::deleteFolder("$dir/$file") : unlink("$dir/$file");
                }

                return rmdir($dir);
            }
        }
    }

    private static function tryGetValue(array $array, $key)
    {
        return (array_key_exists($key, $array)) ? $array[$key] : null;
    }
}
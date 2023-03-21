<?php
require_once ("./API.php");

error_reporting(E_ALL);
ini_set("display_errors", "1");

$decodedData = json_decode(file_get_contents("php://input"), true);
/*
echo "Hello world from server<br>\n";
echo "Post is {$_POST}<br>\n";
echo "Decoded data is {$decodedData}<br>\n";
*/
foreach ($decodedData as $item)
    echo "{$item}<br>\n";

$api = new API();

//$api->processRequest($decodedData);

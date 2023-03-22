<?php

require_once("./API.php");

error_reporting(E_ALL);
ini_set("display_errors", "1");

$decodedData = json_decode(file_get_contents("php://input"), true);

//echo "Decoded data is {$decodedData}<br>\n";

var_dump($decodedData);

//foreach ($decodedData as $item) {
    //echo nl2br("Server says: $item ");
//}

echo $decodedData["action"];

$api = new API();

//$api->processRequest($decodedData);

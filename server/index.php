<?php
#header('Access-Control-Allow-Origin: *');
#header("Access-Control-Allow-Headers: *");
#header("Access-Control-Allow-Methods: *");
#header("Allow: *");

echo "hello world";

#require_once("./API.php");

#error_reporting(E_ALL);
#ini_set("display_errors", "1");

#$decodedData = (array)json_decode(file_get_contents("php://input"));

#$api = new API();

#$api->parseRequest($decodedData);

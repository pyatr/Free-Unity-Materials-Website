<?php
include_once "Autoload.php";

error_reporting(E_ALL);
ini_set("display_errors", "1");

$decodedData = (array)json_decode(file_get_contents("php://input"));

$api = new API();

$api->parseRequest($decodedData);
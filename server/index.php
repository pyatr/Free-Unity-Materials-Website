<?php
include_once "Autoload.php";

$decodedData = (array)json_decode(file_get_contents("php://input"));

$api = new Server\API();

$api->parseRequest($decodedData);
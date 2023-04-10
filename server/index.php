<?php

include_once "Autoload.php";

$decodedData = (array)json_decode(file_get_contents("php://input"));

$api = new API();

$api->parseRequest($decodedData);
//For test custom requests: $api->parseRequest(array("request" => "login", "params" => array("email" => "admin", "password" => "admin")));
<?php

require_once("./API.php");

error_reporting(E_ALL);
ini_set("display_errors", "1");

$decodedData = (array)json_decode(file_get_contents("php://input"));

$api = new API();

$api->parseRequest($decodedData);

//hash passwords
//store cookies in hash so nobody can steal and use them for login
//remember login
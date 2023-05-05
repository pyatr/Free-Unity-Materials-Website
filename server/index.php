<?php
include_once 'Autoload.php';
error_reporting(E_ALL);
ini_set('display_errors', '1');

$api = new Server\APIEndpointController();

$api->parseRequest();
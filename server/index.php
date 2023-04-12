<?php

include_once "Autoload.php";

$decodedData = (array)json_decode(file_get_contents("php://input"));

$api = new API();

$api->parseRequest($decodedData);
//Test requests
//$api->parseRequest(array("request" => "login", "params" => array("email" => "admin", "password" => "admin")));
//echo $api->parseRequest(array("request" => "createPost", "params" => array("title" => "The afsdf", "shortTitle" => "Short title","content" => "Very cool thing", "categories" => "none")));
//echo $api->parseRequest(array("request" => "deletePost", "params" => array("number" => "17")));
//echo $api->parseRequest(array("request" => "updatePost", "params" => array("number" => "3", "title" => "Newer title", "shortTitle" => "Shorter title","content" => "Mediocre thing", "categories" => "scripts")));
//echo $api->parseRequest(array("request" => "getPost", "params" => array("number" => "24")));
//echo $api->parseRequest(array("request" => "getPosts", "params" => array("pageSize" => "6", "page"=>"2")));
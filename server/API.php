<?php

require_once("./Database.php");

class API
{
    private const FRONT_SITE_NAME = "freeunitymaterials.test";

    private Database $Database;

    function __construct()
    {
        $this->Database = new Database();
    }

    public function tryLogin(string $email, string $password): bool
    {
        return $this->Database->tryLogin($email, $password);
    }

    function respond(string $data): void
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data);
    }
}

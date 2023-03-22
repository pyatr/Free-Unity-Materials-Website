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

    public function parseRequest(array $data): void
    {
        foreach ($data as $key => $value) {
            //echo "$key = $value ";
            switch ($key) {
                case "action":
                    $this->performAction($value, $data);
                    break;

                default:
                    break;
            }
        }
    }

    private function tryGetValue($array, $key)
    {
        return (array_key_exists($key, $array)) ? $array[$key] : null;
    }


    private function performAction(string $actionName, array $data)
    {
        switch ($actionName) {
            case "trylogin":
                $email = $this->tryGetValue($data, "email");
                $password = $this->tryGetValue($data, "password");
                $loginStatus = $this->tryLogin($email, $password);
                $response = $loginStatus ? "logged in" : "could not log in";
                $this->respond("Response is $response");
                break;

            default:
                break;
        }
    }

    private function tryLogin(string $email, string $password): bool
    {
        return $this->Database->elementWithParametersExists("USERS", ["EMAIL", "PASSWORD"], [$email, $password]);
    }

    private function respond(
        string $data
    ): void {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data);
    }
}

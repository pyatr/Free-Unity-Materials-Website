<?php

require_once("./Database.php");

class API
{
    private Database $Database;

    function __construct()
    {
        $this->Database = new Database();
    }

    public function parseRequest(array $data): void
    {
        $request = $data["request"];
        $params = (array)$data["params"];
        if ($request != null && $params != null) {
            switch ($request) {
                case "login":
                    $email = $this->tryGetValue($params, "email");
                    $password = $this->tryGetValue($params, "password");
                    if ($email != null && $password != null) {
                        $loginStatus = $this->tryLogin($email, $password);
                        $response = $loginStatus ? "logged in" : "could not log in";
                        $this->respond("Response is $response");
                    }
                    break;
                default:
                    break;
            }
        } else {
            $this->respond("Invalid request: $data");
        }
    }

    private function tryGetValue($array, $key)
    {
        return (array_key_exists($key, $array)) ? $array[$key] : null;
    }

    private function tryLogin(string $email, string $password): bool
    {
        return $this->Database->elementWithParametersExists(
            "USERS",
            ["EMAIL", "PASSWORD"],
            [$email, $password]
        );
    }

    private function respond($data): void
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data);
    }
}

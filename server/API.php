<?php

require_once("./Database.php");
require_once("./UserDatabase.php");

class API
{
    private Database $database;
    private UserDatabase $userDatabase;

    function __construct()
    {
        $this->database = new Database();
        $this->userDatabase = new UserDatabase();
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
                        $response = $loginStatus;
                        $this->respond($response);
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
        return $this->userDatabase->elementWithParametersExists(
            "USERS",
            ["EMAIL", "PASSWORD"],
            [$email, $password]
        );
    }

    private function respond($data): void
    {
        echo json_encode($data);
    }
}

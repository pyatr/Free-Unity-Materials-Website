<?php

class API
{
    private const CIPHERING_METHOD = "AES-128-CTR";

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
            $crypt_iv = '3655362452454452';
            switch ($request) {
                case "login":
                    $email = $this->tryGetValue($params, "email");
                    $password = $this->tryGetValue($params, "password");
                    if ($email != null && $password != null) {
                        $loginStatus = $this->tryLogin($email, $password);
                        if ($loginStatus) {
                            //Hash with User IP
                            $hashedData = openssl_encrypt(
                                json_encode([$email, $password]),
                                self::CIPHERING_METHOD,
                                json_encode($_SERVER["REMOTE_ADDR"]),
                                0,
                                $crypt_iv
                            );
                            $this->respond(array("loginSuccess", $hashedData));
                        } else {
                            $this->respond("failed");
                        }
                    }
                    break;
                case "loginCookie":
                    //$unhashed = openssl_decrypt()
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

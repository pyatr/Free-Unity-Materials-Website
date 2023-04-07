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
        if ($request != null) {
            //TODO: make real IV
            $iv = "1111111111111111";
            //json_encode($_SERVER["REMOTE_ADDR"]) does not work
            $cipher_code = "123";//more complex codes don't work... why?
            switch ($request) {
                case "login":
                    $email = $this->tryGetValue($params, "email");
                    $password = $this->tryGetValue($params, "password");
                    if ($email != null && $password != null) {
                        $loginStatus = $this->tryLogin($email, $password);
                        if ($loginStatus) {
                            //Should hash with User IP
                            $hashedData = openssl_encrypt(
                                json_encode([$email, $password]),
                                self::CIPHERING_METHOD,
                                $cipher_code,
                                OPENSSL_ZERO_PADDING,
                                $iv
                            );
                            $this->respond(array("loginSuccess", $hashedData));
                        }
                    }
                    break;
                case "loginCookie":
                    $cookies = explode(";", $_SERVER["HTTP_COOKIE"]);
                    $cookie = null;
                    foreach ($cookies as $kvp) {
                        $result = explode("=", $kvp);
                        if (count($result)) {
                            if ($result[0] === "userLogin") {
                                //Decode to add special symbols back
                                $cookie = urldecode($result[1]);
                            }
                        }
                    }
                    if ($cookie != null) {
                        $dehashed = openssl_decrypt(
                            $cookie,
                            self::CIPHERING_METHOD,
                            $cipher_code,
                            OPENSSL_ZERO_PADDING,
                            $iv
                        );
                        $decoded = json_decode($dehashed);
                        $loginStatus = $this->tryLogin($decoded[0], $decoded[1]);
                        $this->respond($loginStatus);
                    }
                    break;
                default:
                    break;
            }
        } else {
            $this->respond("Invalid request: " . json_encode($data));
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

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
            $iv = "2750871278425633";
            $cipher_code = json_encode($_SERVER["REMOTE_ADDR"]);
            switch ($request) {
                case "login":
                    $email = $this->tryGetValue($params, "email");
                    $password = $this->tryGetValue($params, "password");
                    $response = array("loginStatus" => "failed");
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
                            $response["loginStatus"] = "success";
                            $response["loginCookie"] = $hashedData;
                        }
                    }
                    $this->respond($response);
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
                    $response = array("loginStatus" => "failed");
                    if ($cookie != null) {
                        $dehashed = openssl_decrypt(
                            $cookie,
                            self::CIPHERING_METHOD,
                            $cipher_code,
                            OPENSSL_ZERO_PADDING,
                            $iv
                        );
                        $decoded = json_decode($dehashed);
                        $email = $decoded[0];
                        $password = $decoded[1];
                        $loginStatus = $this->tryLogin($email, $password);
                        if ($loginStatus) {
                            $response["loginStatus"] = "success";
                            $response["userName"] = $this->userDatabase->getUserName($email);
                        }
                    }
                    $this->respond($response);
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

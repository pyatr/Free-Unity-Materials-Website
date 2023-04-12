<?php

class API
{
    private const CIPHERING_METHOD = "AES-128-CTR";

    private Database $database;
    private UserDatabase $userDatabase;
    private ContentDatabase $contentDatabase;

    function __construct()
    {
        $this->database = new Database();
        $this->userDatabase = new UserDatabase();
        $this->contentDatabase = new ContentDatabase();
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
                    $response = array("loginStatus" => "failed");

                    $cookies = explode("; ", $_SERVER["HTTP_COOKIE"]);
                    $cookie = null;
                    foreach ($cookies as $kvp) {
                        $result = explode("=", $kvp);
                        if (count($result) > 1) {
                            $cookieName = "userLogin";
                            $stringEquality = strcmp($result[0], $cookieName);
                            if ($stringEquality == 0) {
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
                case "createPost":
                    $title = $this->tryGetValue($params, "title");
                    $shortTitle = $this->tryGetValue($params, "shortTitle");
                    $content = $this->tryGetValue($params, "content");
                    $categories = $this->tryGetValue($params, "categories");
                    $response = $this->contentDatabase->createPost($title, $shortTitle, $content, $categories);
                    $this->respond($response);
                    break;
                case "deletePost":
                    $number = $this->tryGetValue($params, "number");
                    $response = $this->contentDatabase->deletePost($number);
                    $this->respond($response);
                    break;
                case "updatePost":
                    $number = $this->tryGetValue($params, "number");
                    $title = $this->tryGetValue($params, "title");
                    $shortTitle = $this->tryGetValue($params, "shortTitle");
                    $content = $this->tryGetValue($params, "content");
                    $categories = $this->tryGetValue($params, "categories");
                    $response = $this->contentDatabase->updatePost($number, $title, $shortTitle, $content, $categories);
                    $this->respond($response);
                    break;
                case "getPost":
                    $number = $this->tryGetValue($params, "number");
                    $response = $this->contentDatabase->getPost($number);
                    $this->respond($response);
                    break;
                case "getPosts":
                    $pageSize = $this->tryGetValue($params, "pageSize");
                    $page = $this->tryGetValue($params, "page");
                    $response = $this->contentDatabase->getPosts($pageSize, $page);
                    $this->respond($response);
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

<?php

namespace Server;

class UserController extends BaseController
{
    private const CIPHERING_METHOD = 'AES-128-CTR';

    private string $initializationVector, $cipherCode;
    private UserModel $userModel;

    function __construct()
    {
        //TODO: make real IV
        $this->initializationVector = '2750871278425633';
        $this->cipherCode = json_encode($_SERVER['REMOTE_ADDR']);
        $this->userModel = new UserModel();
    }

    public function tryLogin($params): array
    {
        $response = array('loginStatus' => 'failed');
        $email = $this->tryGetValue($params, 'email');
        $password = $this->tryGetValue($params, 'password');
        if ($email != null && $password != null) {
            $loginStatus = $this->doesUserExist($email, $password);
            if ($loginStatus) {
                //Should hash with User IP
                $hashedData = openssl_encrypt(
                    json_encode([$email, $password]),
                    self::CIPHERING_METHOD,
                    $this->cipherCode,
                    OPENSSL_ZERO_PADDING,
                    $this->initializationVector
                );
                $response['loginStatus'] = 'success';
                $response['loginCookie'] = $hashedData;
            }
        }
        return $response;
    }

    public function tryLoginWithCookie(): array
    {
        $response = array('loginStatus' => 'failed');
        $cookies = explode('; ', $_SERVER['HTTP_COOKIE']);
        $cookie = null;
        foreach ($cookies as $kvp) {
            $result = explode('=', $kvp);
            if (count($result) > 1) {
                $cookieName = 'userLogin';
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
                $this->cipherCode,
                OPENSSL_ZERO_PADDING,
                $this->initializationVector
            );
            $decoded = json_decode($dehashed);
            $email = $decoded[0];
            $password = $decoded[1];
            $loginStatus = $this->doesUserExist($email, $password);
            if ($loginStatus) {
                $response['loginStatus'] = 'success';
                $response['userName'] = $this->userModel->getUserName($email);
                $response['userEmail'] = $email;
                $response['userRole'] = $this->userModel->getUserRole($email);
            }
        }
        return $response;
    }

    private function getUserRole(string $email): string
    {
        return $this->userModel->getUserRole($email);
    }

    private function doesUserExist(string $email, string $password): bool
    {
        return $this->userModel->elementWithParametersExists(
            'USERS',
            ['EMAIL', 'PASSWORD'],
            [$email, $password]
        );
    }
}
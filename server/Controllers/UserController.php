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

    public function tryLogin($attributes): array
    {
        $response = ['loginStatus' => 'failed'];
        $email = $this->tryGetValue($attributes, 'email');
        $password = $this->tryGetValue($attributes, 'password');
        if ($email == null || $password == null) {
            $response['loginStatus'] = 'no email or password';
            return $response;
        }

        if (!$this->userModel->isUserActivated($email)) {
            $response['loginStatus'] = 'inactive';
            return $response;
        }

        $loginStatus = $this->userModel->tryLogin($email, $password);
        if (!$loginStatus) {
            $response['loginStatus'] = 'could not login';
            return $response;
        }
        $hashedUserPassword = $this->userModel->getUserPassword($email);
        //Should hash with User IP
        $encryptedCookie = $this->encryptLoginPassword($email, $hashedUserPassword);
        $response['loginStatus'] = 'success';
        $response['loginCookie'] = $encryptedCookie;

        return $response;
    }

    private function encryptLoginPassword(string $email, string $password): string
    {
        return openssl_encrypt(
            json_encode([$email, $password]),
            self::CIPHERING_METHOD,
            $this->cipherCode,
            OPENSSL_ZERO_PADDING,
            $this->initializationVector
        );
    }

    public function tryLoginWithCookie(): array
    {
        $response = ['loginStatus' => 'failed'];
        $cookie = CookieManager::getCookie('userLogin');
        if ($cookie == null) {
            $response['loginStatus'] = 'no cookie';
            return $response;
        }
        $decrypted = $this->decryptLoginCookie($cookie);
        $email = $decrypted[0];
        $password = $decrypted[1];
        $loginStatus = $this->userModel->tryLogin($email, $password, false);
        if ($loginStatus) {
            $response['loginStatus'] = 'success';
            $response['userName'] = $this->userModel->getUserName($email);
            $response['userEmail'] = $email;
            $response['userRole'] = $this->userModel->getUserRole($email);
        }

        return $response;
    }

    private function decryptLoginCookie(string $cookie): array
    {
        return json_decode(
            openssl_decrypt(
                $cookie,
                self::CIPHERING_METHOD,
                $this->cipherCode,
                OPENSSL_ZERO_PADDING,
                $this->initializationVector
            )
        );
    }

    public function getPublicUserInfo($attributes): array
    {
        $email = $this->tryGetValue($attributes, 'email');
        $userName = $this->userModel->getUserName($email);
        $userRole = $this->userModel->getUserRole($email);
        $userRegistrationDate = $this->userModel->getUserRegistrationDate($email);
        $isUserActive = $this->userModel->isUserActivated($email);
        return ["userName" => $userName, "role" => $userRole, "registrationDate" => $userRegistrationDate, "isActive" => $isUserActive];
    }

    public function activateUser($attributes): array
    {
        $email = $this->tryGetValue($attributes, 'email');
        $verificationCode = $this->tryGetValue($attributes, 'verificationCode');
        $result = $this->userModel->activateUser($email, $verificationCode);
        if ($result['activationResult'] == 'success') {
            $subject = "Your address has been verified";
            $userName = $this->userModel->getUserName($email);
            $body = "Dear $userName! Thank you for registering on Free Unity Materials.";
            ServerMailer::sendEmail($email, $subject, $body);
            $password = $this->userModel->getUserPassword($email);
            $result['loginCookie'] = $this->encryptLoginPassword($email, $password);
        }
        return $result;
    }

    public function sendActivationCode($attributes)
    {
        $email = $this->tryGetValue($attributes, 'email');
        $verificationCode = $this->generateRandomVerificationCode();

        $this->userModel->addUserVerificationCode($email, $verificationCode);
        $subject = 'Verify your email address';
        $body = "This email address was recently used to create an account on our website.<br/>
            To activate your new account and verify your address enter verification code $verificationCode.<br/>
            If you didn't use this address it means someone else entered it by mistake. In that case you don't have to take any action. Do not tell anyone this code.";
        ServerMailer::sendEmail($email, $subject, $body);
    }

    public function createNewUser($attributes)
    {
        $username = $this->tryGetValue($attributes, 'username');
        $password = $this->tryGetValue($attributes, 'password');
        $email = $this->tryGetValue($attributes, 'email');

        if ($this->userModel->doesUserExist($email)) {
            return ["registrationResult" => "userExists"];
        }

        if ($this->userModel->createNewUser($username, $password, $email)) {
            $this->sendActivationCode($attributes);
            return ["registrationResult" => "userCreated"];
        }
    }

    private function generateRandomVerificationCode(): string
    {
        $code = "";
        $codeLength = 6;
        for ($i = 0; $i < $codeLength; $i++) {
            $code .= rand(0, 9);
        }
        return $code;
    }
}
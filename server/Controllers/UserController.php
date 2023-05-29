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

        $loginStatus = $this->userModel->tryLogin($email, $password);
        if (!$loginStatus) {
            $response['loginStatus'] = 'could not login';
            return $response;
        }

        if (!$this->userModel->isUserActivated($email)) {
            $response['loginStatus'] = 'inactive';
            return $response;
        }

        $hashedUserPassword = $this->userModel->getUserPassword($email);
        //Should hash with User IP
        $encryptedCookie = $this->encryptLoginPassword($email, $hashedUserPassword);
        $response['loginStatus'] = 'success';
        $response['loginCookie'] = $encryptedCookie;

        return $response;
    }

    private function encryptLoginPassword(string $email, string $hashedPassword): string
    {
        return openssl_encrypt(
            json_encode([$email, $hashedPassword]),
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

        if (!$this->userModel->isUserActivated($email)) {
            $response['loginStatus'] = 'inactive';
            return $response;
        }

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
        return ['userName' => $userName, 'role' => $userRole, 'registrationDate' => $userRegistrationDate, 'isActive' => $isUserActive];
    }

    public function addCodeForUserEmailChange($attributes): array
    {
        $result = ['codeAdditionResult' => 'success'];
        $email = $this->tryGetValue($attributes, 'email');
        $verificationCode = GUIDCreator::GUIDv4();
        $this->userModel->addUserEmailChangeCode($email, $verificationCode);
        $userName = $this->userModel->getUserName($email);
        $serviceData = FileManager::getTextFileContents($_SERVER['DOCUMENT_ROOT'] . '/hostdata');
        $serviceHost = $serviceData[0];
        $servicePort = $serviceData[1];
        $verificationLink = "http://$serviceHost:$servicePort/change-email/$verificationCode";
        $mailBody = "Dear $userName!<br/>
Please follow this link to change your email <href>$verificationLink</href><br/>";
        $mailingResult = ServerMailer::sendEmail($email, 'Follow the link to change your email on our website', $mailBody);
        if (!$mailingResult) {
            $this->userModel->clearEmailChangeCodes(urlencode($email));
            $result['codeAdditionResult'] = 'failed';
        }
        return $result;
    }

    public function changeUserEmail($attributes)
    {
        $email = $this->tryGetValue($attributes, 'email');
        $newEmail = $this->tryGetValue($attributes, 'newEmail');
        $givenPassword = $this->tryGetValue($attributes, 'password');
        $password = $this->userModel->getUserPassword($email);

        if ($email == $newEmail) {
            $result['emailChangeResult'] = 'same-email';
            return $result;
        }

        if ($this->userModel->doesUserExist($newEmail)) {
            $result['emailChangeResult'] = 'user-exists';
            return $result;
        }

        if ($givenPassword == null || $givenPassword == "") {
            $result['emailChangeResult'] = 'no-password';
            return $result;
        }

        $loginStatus = $this->userModel->tryLogin($email, $givenPassword);
        if (!$loginStatus) {
            $result['emailChangeResult'] = 'wrong-password';
            return $result;
        }

        $verificationCode = $this->tryGetValue($attributes, 'verificationCode');
        $result = $this->userModel->changeUserEmail($email, $newEmail, $verificationCode);

        $result['loginCookie'] = $this->encryptLoginPassword($newEmail, $password);
        return $result;
    }

    public function checkEmailValidationCode($attributes)
    {
        $verificationCode = $this->tryGetValue($attributes, 'verificationCode');
        return ['isCodeReal' => $this->userModel->doesEmailChangeCodeExist($verificationCode) ? "exists" : "does-not-exist"];
    }

    public function addCodeForUserPasswordChange($attributes)
    {
        $result = ['codeAdditionResult' => 'success'];
        $email = $this->tryGetValue($attributes, 'email');
        $oldPassword = $this->tryGetValue($attributes, 'oldPassword');
        if (!$this->userModel->comparePasswords($email, $oldPassword)) {
            $result['codeAdditionResult'] = 'wrongpassword';
            return $result;
        }

        $newPassword = $this->tryGetValue($attributes, 'newPassword');
        if ($newPassword == $oldPassword) {
            $result['codeAdditionResult'] = 'samepassword';
            return $result;
        }

        $verificationCode = $this->generateRandomVerificationCode();
        $this->userModel->addUserPasswordChangeCode($email, $newPassword, $verificationCode);
        $userName = $this->userModel->getUserName($email);
        $mailBody = "Dear $userName!<br/>
Please verify your new password by entering this verification code $verificationCode.<br/>";
        $mailingResult = ServerMailer::sendEmail($email, 'Verify your new password', $mailBody);
        if (!$mailingResult) {
            $this->userModel->clearPasswordChangeCodes(urlencode($email));
            $result['codeAdditionResult'] = 'failed';
        }
        return $result;
    }

    public function changeUserPassword($attributes)
    {
        $email = $this->tryGetValue($attributes, 'email');
        $verificationCode = $this->tryGetValue($attributes, 'verificationCode');

        $result = $this->userModel->changeUserPassword($email, $verificationCode);
        $password = urldecode($this->userModel->getUserPassword($email));

        $result['loginCookie'] = $this->encryptLoginPassword($email, $password);
        return $result;
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

    public function sendActivationLink($attributes): bool
    {
        $email = $this->tryGetValue($attributes, 'email');
        $pathname = $this->tryGetValue($attributes, 'pathname');
        $verificationCode = GUIDCreator::GUIDv4();

        $this->userModel->addUserVerificationCode($email, $verificationCode);
        $subject = 'Verify your email address';
        $serviceData = FileManager::getTextFileContents($_SERVER['DOCUMENT_ROOT'] . '/hostdata');
        $serviceHost = $serviceData[0];
        $servicePort = $serviceData[1];
        $verificationLink = "http://$serviceHost:$servicePort/$pathname/$verificationCode";
        $body = "This email address was recently used to create an account on our website.<br/>
            To activate your new account and verify your address click this link <href>$verificationLink</href>.<br/>
            If you didn't use this address it means someone else entered it by mistake. In that case you don't have to take any action.";
        return ServerMailer::sendEmail($email, $subject, $body);
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
            $attributes['pathname'] = 'activate';
            if ($this->sendActivationLink($attributes)) {
                return ["registrationResult" => "userCreated"];
            } else {
                return ["registrationResult" => "failedToSendEmail"];
            }
        }
    }

    public function deleteUser($attributes): array
    {
        $email = $this->tryGetValue($attributes, 'email');
        $result = [];
        $result['deletionResult'] = 'failed';
        if ($this->userModel->deleteUser($email)) {
            $result['deletionResult'] = 'success';
        }
        return $result;
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
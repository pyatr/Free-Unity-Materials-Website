<?php

namespace App\Http\Controllers;

use App\Models\EmailChangeCodes;
use App\Models\EmailVerificationCodes;
use App\Models\PasswordChangeCodes;
use App\Models\User;
use App\Utilities\CookieManager;
use App\Utilities\FileManager;
use App\Utilities\GUIDCreator;
use App\Utilities\ServerMailer;
use App\Utilities\SiteInfo;
use Illuminate\Support\Facades\Auth;

class UserController extends BaseController
{
    private const CIPHERING_METHOD = 'AES-128-CTR';

    //TODO: make real IV
    private static string $initializationVector = '2750871278425633';
    private static string $cipherCode = '';

    private static function getCipherCode(): string
    {
        if (self::$cipherCode == '') {
            self::$cipherCode = json_encode($_SERVER['REMOTE_ADDR']);
        }
        return self::$cipherCode;
    }

    public static function tryLogin($parameters): array
    {
        $response = [];
        $email = self::tryGetValue($parameters, 'email');
        $password = self::tryGetValue($parameters, 'password');
        if ($email == null || $password == null) {
            $response['loginStatus'] = 'no email or password';
            return $response;
        }

        $loginStatus = User::tryLogin($email, $password);
        if (!$loginStatus) {
            $response['loginStatus'] = 'could not login';
            return $response;
        }

        if (!User::isUserActivated($email)) {
            $response['loginStatus'] = 'inactive';
            return $response;
        }

        $hashedUserPassword = User::getUserPassword($email);
        //Should hash with User IP
        $encryptedCookie = self::encryptLoginPassword($email, $hashedUserPassword);
        $response['loginStatus'] = 'success';
        $response['loginCookie'] = $encryptedCookie;

        return $response;
    }

    private static function encryptLoginPassword(string $email, string $hashedPassword): string
    {
        return openssl_encrypt(
            json_encode([$email, $hashedPassword]),
            self::CIPHERING_METHOD,
            self::getCipherCode(),
            OPENSSL_ZERO_PADDING,
            self::$initializationVector
        );
    }

    public static function tryLoginWithCookie(): array
    {
        $response = ['loginStatus' => 'failed'];
        $cookie = CookieManager::getCookie('userLogin');
        if ($cookie == null) {
            $response['loginStatus'] = 'no cookie';
            return $response;
        }
        $decrypted = self::decryptLoginCookie($cookie);
        $email = $decrypted[0];
        $password = $decrypted[1];

        if (!User::isUserActivated($email)) {
            $response['loginStatus'] = 'inactive';
            return $response;
        }

        $loginStatus = User::tryLogin($email, $password, false);
        if ($loginStatus) {
            $response['loginStatus'] = 'success';
            $response['userName'] = User::getUserName($email);
            $response['userEmail'] = $email;
            $response['userRole'] = User::getUserRole($email);
        }

        return $response;
    }

    private static function decryptLoginCookie(string $cookie): array
    {
        return json_decode(
            openssl_decrypt(
                $cookie,
                self::CIPHERING_METHOD,
                self::getCipherCode(),
                OPENSSL_ZERO_PADDING,
                self::$initializationVector
            )
        );
    }

    public static function getUserAvatar($email): string
    {
        $userFolderName = User::getUserFolder($email);
        $userAvatarLink = '';
        $userAvatarFilePath = FileManager::getUserAvatarPath($userFolderName);
        if ($userAvatarFilePath != '') {
            $serverData = SiteInfo::getServerInfo();
            $serverHost = $serverData[0];
            $serverPort = $serverData[1];
            $userAvatarLink = "http://$serverHost:$serverPort/$userAvatarFilePath";
        }
        return $userAvatarLink;
    }

    public static function getPublicUserInfo($parameters): array
    {
        $email = self::tryGetValue($parameters, 'email');
        $userName = User::getUserName($email);
        $userRole = User::getUserRole($email);
        $userRegistrationDate = User::getUserRegistrationDate($email);
        $isUserActive = User::isUserActivated($email);
        $userAvatarLink = self::getUserAvatar($email);
        return [
            'userName' => $userName,
            'role' => $userRole,
            'registrationDate' => $userRegistrationDate,
            'isActive' => $isUserActive,
            'avatarLink' => $userAvatarLink
        ];
    }

    public static function addCodeForUserEmailChange($parameters): array
    {
        $result = ['codeAdditionResult' => 'success'];
        $email = self::tryGetValue($parameters, 'email');
        $verificationCode = GUIDCreator::GUIDv4();
        EmailChangeCodes::addUserEmailChangeCode($email, $verificationCode);
        $userName = User::getUserName($email);
        $serviceData = SiteInfo::getHostInfo();
        $serviceHost = $serviceData[0];
        $servicePort = $serviceData[1];
        $verificationLink = "http://$serviceHost:$servicePort/change-email/$verificationCode";
        $mailBody = "Dear $userName!<br/>
Please follow this link to change your email <href>$verificationLink</href><br/>";
        $mailingResult = ServerMailer::sendEmail($email, 'Follow the link to change your email on our website', $mailBody);
        if (!$mailingResult) {
            EmailChangeCodes::deleteEmailChangeCode(urlencode($email));
            $result['codeAdditionResult'] = 'failed';
        }
        return $result;
    }

    public static function changeUserEmail($parameters): array
    {
        $email = self::tryGetValue($parameters, 'email');
        $newEmail = self::tryGetValue($parameters, 'newEmail');
        $givenPassword = self::tryGetValue($parameters, 'password');
        $password = User::getUserPassword($email);

        if ($email == $newEmail) {
            $result['emailChangeResult'] = 'same-email';
            return $result;
        }

        if (User::doesUserExist($newEmail)) {
            $result['emailChangeResult'] = 'user-exists';
            return $result;
        }

        if ($givenPassword == null || $givenPassword == '') {
            $result['emailChangeResult'] = 'no-password';
            return $result;
        }

        $loginStatus = User::tryLogin($email, $givenPassword);
        if (!$loginStatus) {
            $result['emailChangeResult'] = 'wrong-password';
            return $result;
        }

        $verificationCode = self::tryGetValue($parameters, 'verificationCode');
        $result = EmailChangeCodes::changeUserEmail($email, $newEmail, $verificationCode);

        $result['loginCookie'] = self::encryptLoginPassword($newEmail, $password);
        return $result;
    }

    public static function checkEmailValidationCode($parameters): array
    {
        $verificationCode = self::tryGetValue($parameters, 'verificationCode');
        return ['isCodeReal' => EmailChangeCodes::emailChangeCodeExists($verificationCode) ? 'exists' : 'does-not-exist'];
    }

    public static function checkPasswordValidationCode($parameters): array
    {
        $verificationCode = self::tryGetValue($parameters, 'verificationCode');
        return ['isCodeReal' => PasswordChangeCodes::passwordChangeCodeExists($verificationCode) ? 'exists' : 'does-not-exist'];
    }

    public static function addCodeForUserPasswordChange($parameters): array
    {
        $result = ['codeAdditionResult' => 'success'];
        $email = self::tryGetValue($parameters, 'email');
        $verificationCode = GUIDCreator::GUIDv4();
        PasswordChangeCodes::addUserPasswordChangeCode($email, $verificationCode);
        $userName = User::getUserName($email);
        $serviceData = SiteInfo::getHostInfo();
        $serviceHost = $serviceData[0];
        $servicePort = $serviceData[1];
        $verificationLink = "http://$serviceHost:$servicePort/change-password/$verificationCode";
        $mailBody = "Dear $userName!<br/>
Please follow this link to change your password <html>$verificationLink</html>";
        $mailingResult = ServerMailer::sendEmail($email, 'Follow the link to change your password on our website', $mailBody);
        if (!$mailingResult) {
            PasswordChangeCodes::deletePasswordChangeCode(urlencode($email));
            $result['codeAdditionResult'] = 'failed';
        }
        return $result;
    }

    public static function changeUserPassword($parameters): array
    {
        $result['passwordChangeResult'] = 'success';
        $verificationCode = self::tryGetValue($parameters, 'verificationCode');
        $email = PasswordChangeCodes::getEmailForPasswordChangeCode($verificationCode);
        $email = urldecode($email);

        $newPassword = self::tryGetValue($parameters, 'newPassword');
        if (User::comparePasswords($email, $newPassword)) {
            $result['passwordChangeResult'] = 'same-password';
            return $result;
        }

        $result = PasswordChangeCodes::changeUserPassword($email, $newPassword, $verificationCode);
        $password = urldecode(User::getUserPassword($email));

        $result['loginCookie'] = self::encryptLoginPassword($email, $password);
        return $result;
    }

    public static function setUserAvatar($parameters)
    {
        $email = self::tryGetValue($parameters, 'email');
        $avatarImageBase64 = self::tryGetValue($parameters, 'avatarImageBase64');
        $userFolderName = User::getUserFolder($email);
        FileManager::saveUserAvatar($userFolderName, $avatarImageBase64);
    }

    public static function activateUser($parameters): array
    {
        $email = self::tryGetValue($parameters, 'email');
        $verificationCode = self::tryGetValue($parameters, 'verificationCode');
        $result = EmailVerificationCodes::activateUser($email, $verificationCode);
        if ($result['activationResult'] == 'success') {
            $subject = 'Your address has been verified';
            $userName = User::getUserName($email);
            $body = "Dear $userName! Thank you for registering on Free Unity Materials.";
            ServerMailer::sendEmail($email, $subject, $body);
            $password = User::getUserPassword($email);
            $result['loginCookie'] = self::encryptLoginPassword($email, $password);
        }
        return $result;
    }

    public static function sendActivationLink($parameters): bool
    {
        $email = self::tryGetValue($parameters, 'email');
        $pathname = self::tryGetValue($parameters, 'pathname');
        $verificationCode = GUIDCreator::GUIDv4();

        EmailVerificationCodes::addUserVerificationCode($email, $verificationCode);
        $subject = 'Verify your email address';
        $serviceData = SiteInfo::getHostInfo();
        $serviceHost = $serviceData[0];
        $servicePort = $serviceData[1];
        $verificationLink = "http://$serviceHost:$servicePort/$pathname/$verificationCode";
        $body = "This email address was recently used to create an account on our website.<br/>
            To activate your new account and verify your address click this link <href>$verificationLink</href>.<br/>
            If you didn't use this address it means someone else entered it by mistake. In that case you don't have to take any action.";
        return ServerMailer::sendEmail($email, $subject, $body);
    }

    public static function createNewUser($parameters)
    {
        (new UserController())->validate(request(), [
            'username' => 'required',
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $username = self::tryGetValue($parameters, 'username');
        $password = self::tryGetValue($parameters, 'password');
        $email = self::tryGetValue($parameters, 'email');

        if (User::doesUserExist($email)) {
            return ['registrationResult' => 'userExists'];
        }
        $userFolderName = GUIDCreator::GUIDv4();
        $newUser = User::createNewUser($username, $password, $email, $userFolderName);

        //FileManager::createUserFolder($userFolderName);
        /*
        auth()->login($newUser, true);
        if (Auth::check()) {
            return 'arf';
        }
        User::deleteUser($email);
        $parameters['pathname'] = 'activate';
        if (self::sendActivationLink($parameters)) {
            return ['registrationResult' => 'userCreated'];
        } else {
            return ['registrationResult' => 'failedToSendEmail'];
        }*/
    }

    public static function deleteUser($parameters): array
    {
        $email = self::tryGetValue($parameters, 'email');
        $userFolderName = User::getUserFolder($email);
        $result = [];
        $result['deletionResult'] = 'failed';
        if (User::deleteUser($email)) {
            $result['deletionResult'] = 'success';
            FileManager::deleteUserFolder($userFolderName);
        }
        return $result;
    }
}

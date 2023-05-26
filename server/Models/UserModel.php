<?php

namespace Server;

use PDO;

class UserModel extends BaseModel
{
    private const TABLE_USERS = 'USERS';
    private const TABLE_VERIFICATION_CODES = 'USER_VERIFICATION_CODES';
    private const TABLE_EMAIL_CHANGE_CODES = 'EMAIL_CHANGE_CODES';
    private const TABLE_PASSWORD_CHANGE_CODES = 'PASSWORD_CHANGE_CODES';

    private const ROLE_EDITOR = 'EDITOR';
    private const ROLE_ADMIN = 'ADMIN';
    private const ROLE_USER = 'USER';

    private const ENTRY_USERNAME = 'USERNAME';
    private const ENTRY_PASSWORD = 'PASSWORD';
    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_NEW_EMAIL = 'NEW_EMAIL';
    private const ENTRY_NEW_PASSWORD = 'NEW_PASSWORD';
    private const ENTRY_STATUS = 'STATUS';
    private const ENTRY_ACTIVATED = 'ACTIVATED';

    private const ENTRY_REGISTRATION_DATE = 'REGISTRATION_DATE';
    private const ENTRY_VERIFICATION_CODE = 'VERIFICATION_CODE';

    public function isUserActivated(string $email): bool
    {
        return $this->getUserAttribute($email, $this::ENTRY_ACTIVATED) == '1';
    }

    public function addUserVerificationCode(string $email, string $code)
    {
        $email = urlencode($email);
        $insertQueryObject = new InsertQueryBuilder();
        $insertQueryObject->
        insert(
            $this::TABLE_VERIFICATION_CODES,
            [$this::ENTRY_EMAIL, $this::ENTRY_VERIFICATION_CODE],
            [$email, $code]
        );
        $request = $this->DBConn->prepare($insertQueryObject->getQuery());
        $request->execute();
    }

    private function verificationCodeExists(string $code, string $tableName): bool
    {
        //Check if user code is valid
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(["*"])->
        from($tableName)->
        where([$this::ENTRY_VERIFICATION_CODE, '=', "'$code'"]);
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return $request->fetchAll(PDO::FETCH_NUM)[0][0] > 0;
    }

    private function deleteVerificationCode(string $URLencodedEmail, string $tableName)
    {
        $this->delete($tableName, [$this::ENTRY_EMAIL, '=', "'$URLencodedEmail'"]);
    }

    public function clearEmailChangeCodes(string $URLencodedEmail)
    {
        $this->deleteVerificationCode($URLencodedEmail, $this::TABLE_EMAIL_CHANGE_CODES);
    }

    public function addUserEmailChangeCode(string $email, string $newEmail, string $code)
    {
        $email = urlencode($email);
        $newEmail = urlencode($newEmail);
        $insertQueryObject = new InsertQueryBuilder();
        $insertQueryObject->
        insert(
            $this::TABLE_EMAIL_CHANGE_CODES,
            [$this::ENTRY_EMAIL, $this::ENTRY_NEW_EMAIL, $this::ENTRY_VERIFICATION_CODE],
            [$email, $newEmail, $code]
        );
        $request = $this->DBConn->prepare($insertQueryObject->getQuery());
        $request->execute();
    }

    public function changeUserEmail(string $oldEmail, string $code): array
    {
        $result = ['emailChangeResult' => 'failed'];
        $isCodeValid = $this->verificationCodeExists($code, $this::TABLE_EMAIL_CHANGE_CODES);
        if (!$isCodeValid) {
            return $result;
        }
        $oldEmail = urlencode($oldEmail);

        //Get new email saved from first request
        $emailSelectResult = $this->select(
            [$this::ENTRY_NEW_EMAIL],
            $this::TABLE_EMAIL_CHANGE_CODES,
            [$this::ENTRY_EMAIL, '=', "'$oldEmail'"]
        );
        if (count($emailSelectResult) == 0) {
            return $result;
        }
        $matchingEmailCount = count($emailSelectResult);
        $newEmail = $emailSelectResult[$matchingEmailCount - 1]['NEW_EMAIL'];
        //Update user email
        $this->update($this::TABLE_USERS, [$this::ENTRY_EMAIL], [$newEmail], [$this::ENTRY_EMAIL, '=', "'$oldEmail'"]);

        //Remove verification code
        $this->deleteVerificationCode($oldEmail, $this::TABLE_EMAIL_CHANGE_CODES);
        $result['emailChangeResult'] = 'success';
        return ['newEmail' => urldecode($newEmail), 'queryResult' => $result];
    }

    public function clearPasswordChangeCodes(string $URLencodedEmail)
    {
        $this->deleteVerificationCode($URLencodedEmail, $this::TABLE_PASSWORD_CHANGE_CODES);
    }

    public function addUserPasswordChangeCode(string $email, string $newPassword, string $code)
    {
        $email = urlencode($email);
        $newPassword = urlencode(hash($this::HASHING_ALGORITHM, $newPassword));
        $insertQueryObject = new InsertQueryBuilder();
        $insertQueryObject->
        insert(
            $this::TABLE_PASSWORD_CHANGE_CODES,
            [$this::ENTRY_EMAIL, $this::ENTRY_NEW_PASSWORD, $this::ENTRY_VERIFICATION_CODE],
            [$email, $newPassword, $code]
        );
        $request = $this->DBConn->prepare($insertQueryObject->getQuery());
        $request->execute();
    }

    public function changeUserPassword(string $email, string $code): array
    {
        $result = ['passwordChangeResult' => 'failed'];
        $isCodeValid = $this->verificationCodeExists($code, $this::TABLE_PASSWORD_CHANGE_CODES);
        if (!$isCodeValid) {
            return $result;
        }
        $email = urlencode($email);

        //Get new password saved from first request
        $passwordSelectResult = $this->select(
            [$this::ENTRY_NEW_PASSWORD],
            $this::TABLE_PASSWORD_CHANGE_CODES,
            [$this::ENTRY_EMAIL, '=', "'$email'"]
        );
        if (count($passwordSelectResult) == 0) {
            return $result;
        }
        $matchingPasswordCount = count($passwordSelectResult);
        $newPassword = $passwordSelectResult[$matchingPasswordCount - 1]['NEW_PASSWORD'];
        //Update user password
        $this->update($this::TABLE_USERS, [$this::ENTRY_PASSWORD], [$newPassword], [$this::ENTRY_EMAIL, '=', "'$email'"]);

        //Remove verification code
        $this->deleteVerificationCode($email, $this::TABLE_PASSWORD_CHANGE_CODES);
        $result['passwordChangeResult'] = 'success';
        return $result;
    }

    public function activateUser(string $email, string $code): array
    {
        $result = ['activationResult' => 'failed'];
        $isCodeValid = $this->verificationCodeExists($code, $this::TABLE_VERIFICATION_CODES);
        if (!$isCodeValid) {
            return $result;
        }
        $email = urlencode($email);

        //Activate user
        $this->update($this::TABLE_USERS, [$this::ENTRY_ACTIVATED], ['1'], [$this::ENTRY_EMAIL, '=', "'$email'"]);

        //Remove verification code
        $this->deleteVerificationCode($email, $this::TABLE_VERIFICATION_CODES);
        $result['activationResult'] = 'success';
        return $result;
    }

    public function doesUserExist(string $email): bool
    {
        $email = urlencode($email);
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(["COUNT(1)"])->
        from($this::TABLE_USERS)->
        where(['EMAIL', '=', "'$email'"]);
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return $request->fetchAll(PDO::FETCH_NUM)[0][0] > 0;
    }

    public function tryLogin(string $email, string $password, bool $hashPassword = true): bool
    {
        $password = urlencode($password);
        //TODO: Still no multiple 'where' support
        if (!$this->doesUserExist($email)) {
            return false;
        }
        $givenHashedPassword = $hashPassword ? hash(BaseModel::HASHING_ALGORITHM, $password) : $password;
        $hashedPassword = $this->getUserAttribute($email, $this::ENTRY_PASSWORD);
        if ($givenHashedPassword == $hashedPassword) {
            return true;
        }
        return false;
    }

    public function getUserAttribute(string $email, string $attribute): string
    {
        $email = urlencode($email);
        $result = $this->select([$attribute], $this::TABLE_USERS, [$this::ENTRY_EMAIL, '=', "'$email'"]);
        return urldecode($result[0][$attribute]);
    }

    public function getUserName(string $email): string
    {
        return $this->getUserAttribute($email, $this::ENTRY_USERNAME);
    }

    public function getUserRole(string $email): string
    {
        return $this->getUserAttribute($email, $this::ENTRY_STATUS);
    }

    public function getUserPassword(string $email): string
    {
        return $this->getUserAttribute($email, $this::ENTRY_PASSWORD);
    }

    public function getUserRegistrationDate(string $email): string
    {
        return $this->getUserAttribute($email, $this::ENTRY_REGISTRATION_DATE);
    }

    public function comparePasswords(string $email, string $givenPassword): bool
    {
        $userPassword = $this->getUserPassword($email);
        $givenPassword = urlencode(hash($this::HASHING_ALGORITHM, $givenPassword));
        return $userPassword == $givenPassword;
    }

    public function createNewUser(string $newName, string $password, string $email): bool
    {
        $email = urlencode($email);

        if (!$this->doesUserExist($email)) {
            $password = urlencode($password);
            $newName = urlencode($newName);

            $hashedPassword = hash(BaseModel::HASHING_ALGORITHM, $password);
            $insertQueryObject = new InsertQueryBuilder();
            $insertQueryObject->
            insert(
                $this::TABLE_USERS,
                [$this::ENTRY_USERNAME, $this::ENTRY_PASSWORD, $this::ENTRY_EMAIL, $this::ENTRY_STATUS],
                [$newName, $hashedPassword, $email, $this::ROLE_USER]
            );
            $request = $this->DBConn->prepare($insertQueryObject->getQuery());
            $request->execute();
            //TODO: Check if insert was successful
            return true;
        }
        return false;
    }

    public function deleteUser($email): bool
    {
        if (!$this->doesUserExist($email)) {
            return false;
        }
        $email = urlencode($email);
        $this->delete($this::TABLE_USERS, [$this::ENTRY_EMAIL, '=', "'$email'"]);
        $this->deleteVerificationCode($email, $this::TABLE_VERIFICATION_CODES);
        $this->deleteVerificationCode($email, $this::TABLE_VERIFICATION_CODES);
        $this->deleteVerificationCode($email, $this::TABLE_VERIFICATION_CODES);
        return true;
    }
}
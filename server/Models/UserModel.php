<?php

namespace Server;

use PDO;

class UserModel extends BaseModel
{
    private const TABLE_USERS = 'USERS';

    private const TABLE_VERIFICATION_CODES = 'USER_VERIFICATION_CODES';

    private const ROLE_EDITOR = 'EDITOR';
    private const ROLE_ADMIN = 'ADMIN';
    private const ROLE_USER = 'USER';

    private const ENTRY_USERNAME = 'USERNAME';
    private const ENTRY_PASSWORD = 'PASSWORD';
    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_STATUS = 'STATUS';
    private const ENTRY_ACTIVATED = 'ACTIVATED';
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

    public function activateUser(string $email, string $code): array
    {
        $email = urlencode($email);
        $result = ['activationResult' => 'failed'];
        //Check if user code is valid
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select(["*"])->
        from($this::TABLE_VERIFICATION_CODES)->
        where([$this::ENTRY_VERIFICATION_CODE, '=', "'$code'"]);
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        $isCodeValid = $request->fetchAll(PDO::FETCH_NUM)[0][0] > 0;
        if (!$isCodeValid) {
            return $result;
        }
        //Activate user
        $userUpdateQueryObject = new UpdateQueryBuilder();
        $userUpdateQueryObject->
        update($this::TABLE_USERS, [$this::ENTRY_ACTIVATED], ['1'])->
        where([$this::ENTRY_EMAIL, '=', "'$email'"]);
        $request = $this->DBConn->prepare($userUpdateQueryObject->getQuery());
        $request->execute();

        //Remove verification code
        $deleteQueryObject = new DeleteQueryBuilder();
        $deleteQueryObject->
        delete($this::TABLE_VERIFICATION_CODES)->
        where([$this::ENTRY_EMAIL, '=', "'$email'"]);
        $request = $this->DBConn->prepare($deleteQueryObject->getQuery());
        $request->execute();
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
        if (!$this->doesUserExist($email) || !$this->isUserActivated($email)) {
            return false;
        }
        $givenHashedPassword = $hashPassword ? hash(BaseModel::HASHING_ALGORITHM, $password) : $password;
        $hashedPassword = $this->getUserAttribute($email, $this::ENTRY_PASSWORD);
        if ($givenHashedPassword == $hashedPassword) {
            return true;
        }
        return false;
    }

    //How to change username: UPDATE USERS SET USERNAME = 'newname' WHERE USERNAME = 'oldname';

    public function getUserAttribute(string $email, string $attribute): string
    {
        $email = urlencode($email);
        $selectQueryObject = new SelectQueryBuilder();
        $selectQueryObject->
        select([$attribute])->
        from($this::TABLE_USERS)->
        where([$this::ENTRY_EMAIL, '=', "'$email'"]);
        $request = $this->DBConn->prepare($selectQueryObject->getQuery());
        $request->execute();
        return urldecode($request->fetch(PDO::FETCH_NAMED)[$attribute]);
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
}
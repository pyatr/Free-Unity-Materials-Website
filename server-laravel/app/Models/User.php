<?php

namespace App\Models;

use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @mixin Builder
 */
class User extends \TCG\Voyager\Models\User implements MustVerifyEmailContract
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        self::ENTRY_USERNAME,
        self::ENTRY_EMAIL,
        self::ENTRY_STATUS,
        self::ENTRY_PASSWORD,
        self::ENTRY_USER_FOLDER
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $table = 'users';

    private const HASHING_ALGORITHM = 'md5';

    private const ROLE_EDITOR = 'EDITOR';
    private const ROLE_ADMIN = 'ADMIN';
    private const ROLE_USER = 'USER';

    private const ENTRY_USERNAME = 'name';
    private const ENTRY_EMAIL = 'email';
    private const ENTRY_PASSWORD = 'password';
    private const ENTRY_STATUS = 'status';
    private const ENTRY_UPDATED_DATE = 'updated_at';
    private const ENTRY_REGISTRATION_DATE = 'created_at';
    private const ENTRY_ACTIVATED = 'email_verified_at';
    private const ENTRY_USER_FOLDER = 'user_folder';

    public static function doesUserExist(string $email): bool
    {
        return User::where(self::ENTRY_EMAIL, '=', $email)->count() > 0;
    }

    public static function tryLogin(string $email, string $password, bool $shouldHashPassword = true): bool
    {
        if (!self::doesUserExist($email)) {
            return false;
        }
        $givenHashedPassword = $shouldHashPassword ? hash(self::HASHING_ALGORITHM, $password) : $password;
        $hashedPassword = self::getUserAttribute($email, self::ENTRY_PASSWORD);
        return $givenHashedPassword == $hashedPassword;
    }

    public static function getUserAttribute(string $email, string $attribute): string
    {
        $requestResult = User::where(self::ENTRY_EMAIL, '=', "$email")->get($attribute)->toArray();
        return $requestResult[0][$attribute];
    }

    public static function getUserName(string $email): string
    {
        return self::getUserAttribute($email, self::ENTRY_USERNAME);
    }

    public static function getUserRole(string $email): string
    {
        return self::getUserAttribute($email, self::ENTRY_STATUS);
    }

    public static function getUserPassword(string $email): string
    {
        return self::getUserAttribute($email, self::ENTRY_PASSWORD);
    }

    public static function isUserActivated(string $email): bool
    {
        return self::getUserAttribute($email, self::ENTRY_ACTIVATED) != 'NULL';
    }

    public static function getUserRegistrationDate(string $email): string
    {
        return self::getUserAttribute($email, self::ENTRY_REGISTRATION_DATE);
    }

    public static function getUserFolder(string $email): string
    {
        return self::getUserAttribute($email, self::ENTRY_USER_FOLDER);
    }

    public static function comparePasswords(string $email, string $givenPassword): bool
    {
        $userPassword = self::getUserPassword($email);
        //See up hashing.php for current encryption driver
        return $userPassword == bcrypt($givenPassword);
    }

    public static function createNewUser(string $newName, string $password, string $email, string $userFolderName): User
    {
        if (!self::doesUserExist($email)) {
            $newUser = User::create([
                self::ENTRY_USERNAME => $newName,
                self::ENTRY_PASSWORD => $password,
                self::ENTRY_EMAIL => $email,
                self::ENTRY_USER_FOLDER => $userFolderName
            ]);
            //Documentation says email is sent automatically that appears to not be the case
            $newUser->sendEmailVerificationNotification();
            auth()->login($newUser, true);
            return $newUser;
        }
        return User::where(self::ENTRY_EMAIL, '=', $email);
    }

    public static function activate(string $email)
    {
        User::where([self::ENTRY_EMAIL, '=', $email])->update([self::ENTRY_ACTIVATED => '1']);
    }

    public static function changeEmail(string $oldEmail, string $newEmail)
    {
        User::where([self::ENTRY_EMAIL, '=', $oldEmail])->update([self::ENTRY_EMAIL => $newEmail]);
    }

    public static function changePassword(string $email, string $newPassword)
    {
        User::where([self::ENTRY_EMAIL, '=', $email])->update([self::ENTRY_PASSWORD => $newPassword]);
    }

    public static function deleteUser($email): bool
    {
        if (!self::doesUserExist($email)) {
            return false;
        }
        User::select()->where([self::ENTRY_EMAIL, '=', $email])->delete();
        EmailVerificationCodes::deleteVerificationCode($email);
        EmailChangeCodes::deleteEmailChangeCode($email);
        PasswordChangeCodes::deletePasswordChangeCode($email);
        return true;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 */
class PasswordChangeCodes extends Model
{
    use HasFactory;

    protected $table = 'PASSWORD_CHANGE_CODES';
    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_VERIFICATION_CODE = 'VERIFICATION_CODE';

    public static function addUserPasswordChangeCode(string $email, string $code)
    {
        $email = urlencode($email);
        PasswordChangeCodes::create([self::ENTRY_EMAIL => $email, self::ENTRY_VERIFICATION_CODE => $code]);
    }

    public static function passwordChangeCodeExists(string $code): bool
    {
        return PasswordChangeCodes::where([self::ENTRY_VERIFICATION_CODE, '=', "$code"])->count() > 0;
    }

    public static function deletePasswordChangeCode(string $URLencodedEmail)
    {
        EmailChangeCodes::where([self::ENTRY_EMAIL, '=', "'$URLencodedEmail'"])->delete();
    }

    public static function getEmailForPasswordChangeCode(string $code): string
    {
        return PasswordChangeCodes::where([self::ENTRY_VERIFICATION_CODE, '=', "$code"])->get([self::ENTRY_EMAIL]);
    }

    public static function changeUserPassword(string $email, string $newPassword, string $code): array
    {
        $result = ['passwordChangeResult' => 'failed'];
        $isCodeValid = self::passwordChangeCodeExists($code);
        if (!$isCodeValid) {
            return $result;
        }
        User::changePassword($email, $newPassword);
        self::deletePasswordChangeCode($email);
        $result['passwordChangeResult'] = 'success';
        return $result;
    }
}

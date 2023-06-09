<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 */
class EmailVerificationCodes extends Model
{
    use HasFactory;

    protected $table = 'USER_VERIFICATION_CODES';
    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_VERIFICATION_CODE = 'VERIFICATION_CODE';

    public static function addUserVerificationCode(string $email, string $code)
    {
        $email = urlencode($email);
        EmailVerificationCodes::create([self::ENTRY_EMAIL => $email, self::ENTRY_VERIFICATION_CODE => $code]);
    }

    public static function verificationCodeExists(string $code): bool
    {
        return EmailVerificationCodes::where([self::ENTRY_VERIFICATION_CODE, '=', "$code"])->count() > 0;
    }

    public static function deleteVerificationCode(string $URLencodedEmail)
    {
        EmailVerificationCodes::where([self::ENTRY_EMAIL, '=', "'$URLencodedEmail'"])->delete();
    }

    public static function activateUser(string $email, string $code): array
    {
        $result = ['activationResult' => 'failed'];
        $isCodeValid = self::verificationCodeExists($code);
        if (!$isCodeValid) {
            return $result;
        }
        User::activate($email);
        self::deleteVerificationCode($email);
        $result['activationResult'] = 'success';
        return $result;
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 */
class EmailChangeCodes extends Model
{
    use HasFactory;

    protected $table = 'EMAIL_CHANGE_CODES';
    private const ENTRY_EMAIL = 'EMAIL';
    private const ENTRY_VERIFICATION_CODE = 'VERIFICATION_CODE';

    public static function addUserEmailChangeCode(string $email, string $code)
    {
        $email = urlencode($email);
        EmailVerificationCodes::create([self::ENTRY_EMAIL => $email, self::ENTRY_VERIFICATION_CODE => $code]);
    }

    public static function emailChangeCodeExists(string $code): bool
    {
        return EmailChangeCodes::where([self::ENTRY_VERIFICATION_CODE, '=', "$code"])->count() > 0;
    }

    public static function deleteEmailChangeCode(string $URLencodedEmail)
    {
        EmailChangeCodes::where([self::ENTRY_EMAIL, '=', "'$URLencodedEmail'"])->delete();
    }

    public static function changeUserEmail(string $oldEmail, string $newEmail, string $code): array
    {
        $result = ['emailChangeResult' => 'failed'];
        $isCodeValid = self::emailChangeCodeExists($code);
        if (!$isCodeValid) {
            return $result;
        }
        User::changeEmail($oldEmail, $newEmail);
        self::deleteEmailChangeCode($oldEmail);
        $result['emailChangeResult'] = 'success';
        return $result;
    }
}

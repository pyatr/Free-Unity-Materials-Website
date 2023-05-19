<?php

namespace Server;

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

class ServerMailer
{
    public static function sendEmail(string $address, string $subject, string $body, string $nonhtmlbody = '')
    {
        $smtpdata = FileManager::getTextFileContents($_SERVER['DOCUMENT_ROOT'] . '/smtpdata');
        if (count($smtpdata) < 3) {
            return;
        }
        $SMTPhost = $smtpdata[0];
        $SMTPusername = $smtpdata[1];
        $SMTPpassword = $smtpdata[2];
        $mail = new PHPMailer(true);
        try {
            $mail->SMTPDebug = SMTP::DEBUG_OFF;
            $mail->isSMTP();
            $mail->Host = $SMTPhost;
            $mail->SMTPAuth = true;
            $mail->Username = $SMTPusername;
            $mail->Password = $SMTPpassword;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;

            //Server name is not used if using non-local SMTP server such as gmail
            $mail->setFrom('server@freeunitymaterials.com', 'Free Unity Materials');
            $mail->addAddress($address);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->AltBody = $nonhtmlbody != '' ? $nonhtmlbody : $body;

            $mail->send();
            ServerLogger::Log("Message has been sent to $address");
        } catch (Exception $e) {
            ServerLogger::Log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
            ServerLogger::Log("Exception {$e}");
        }
    }
}
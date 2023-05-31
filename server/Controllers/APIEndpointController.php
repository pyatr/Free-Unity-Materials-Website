<?php

namespace Server;

class APIEndpointController
{
    public function parseRequest(): void
    {
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            return;
        }
        $data = (array)json_decode(file_get_contents('php://input'));

        $request = $data['request'];
        $attributes = (array)$data['attributes'];
        if ($request != null) {
            $userControllerName = "Server\\UserController";
            $contentControllerName = "Server\\ContentController";
            $commentControllerName = "Server\\CommentController";

            $controllers = [
                'createNewUser' => $userControllerName,
                'activateUser' => $userControllerName,
                'sendActivationCode' => $userControllerName,
                'sendActivationLink' => $userControllerName,
                'getPublicUserInfo' => $userControllerName,
                'addCodeForUserEmailChange' => $userControllerName,
                'changeUserEmail' => $userControllerName,
                'checkEmailValidationCode' => $userControllerName,
                'checkPasswordValidationCode' => $userControllerName,
                'addCodeForUserPasswordChange' => $userControllerName,
                'changeUserPassword' => $userControllerName,
                'deleteUser' => $userControllerName,
                'login' => $userControllerName,
                'loginCookie' => $userControllerName,

                'createContent' => $contentControllerName,
                'deleteContent' => $contentControllerName,
                'updateContent' => $contentControllerName,
                'getContent' => $contentControllerName,
                'getPreviews' => $contentControllerName,
                'getAllPreviews' => $contentControllerName,

                'addComment' => $commentControllerName,
                'deleteComment' => $commentControllerName,
                'updateComment' => $commentControllerName,
                'getComments' => $commentControllerName,
                'getCommentCount' => $commentControllerName
            ];
            //Choosing controller for request
            $reflection = new \ReflectionClass($controllers[$request]);
            $controller = $reflection->newInstance();
            switch ($request) {
                case 'createNewUser':
                    $this->respond($controller->createNewUser($attributes));
                    break;
                case 'activateUser':
                    $this->respond($controller->activateUser($attributes));
                    break;
                case 'sendActivationLink':
                    $this->respond($controller->sendActivationLink($attributes));
                    break;
                case 'getPublicUserInfo':
                    $this->respond($controller->getPublicUserInfo($attributes));
                    break;
                case 'addCodeForUserEmailChange':
                    $this->respond($controller->addCodeForUserEmailChange($attributes));
                    break;
                case 'changeUserEmail':
                    $this->respond($controller->changeUserEmail($attributes));
                    break;
                case 'checkEmailValidationCode':
                    $this->respond($controller->checkEmailValidationCode($attributes));
                    break;
                case 'checkPasswordValidationCode':
                    $this->respond($controller->checkPasswordValidationCode($attributes));
                    break;
                case 'addCodeForUserPasswordChange':
                    $this->respond($controller->addCodeForUserPasswordChange($attributes));
                    break;
                case 'changeUserPassword':
                    $this->respond($controller->changeUserPassword($attributes));
                    break;
                case 'deleteUser':
                    $this->respond($controller->deleteUser($attributes));
                    break;
                case 'login':
                    $this->respond($controller->tryLogin($attributes));
                    break;
                case 'loginCookie':
                    $this->respond($controller->tryLoginWithCookie());
                    break;
                case 'createContent':
                    $this->respond($controller->createContent($attributes));
                    break;
                case 'deleteContent':
                    $this->respond($controller->deleteContent($attributes));
                    break;
                case 'updateContent':
                    $this->respond($controller->updateContent($attributes));
                    break;
                case 'getContent':
                    $this->respond($controller->getContent($attributes));
                    break;
                case 'getPreviews':
                    $this->respond($controller->getContentPreviews($attributes));
                    break;
                case 'getAllPreviews':
                    $this->respond($controller->getAllContentPreviews($attributes));
                    break;
                case 'addComment':
                    $this->respond($controller->addComment($attributes));
                    break;
                case 'updateComment':
                    $this->respond($controller->updateComment($attributes));
                    break;
                case 'deleteComment':
                    $this->respond($controller->deleteComment($attributes));
                    break;
                case 'getComments':
                    $this->respond($controller->getComments($attributes));
                    break;
                case 'getCommentCount':
                    $this->respond($controller->getCommentCount($attributes));
                    break;
                default:
                    break;
            }
        }
    }

    private function respond($data): void
    {
        echo json_encode($data);
    }
}

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
        $attributes = (array)$data['params'];
        if ($request != null) {
            $controllers = array(
                'login' => "Server\\UserController",
                'loginCookie' => "Server\\UserController",
                'createContent' => "Server\\ContentController",
                'deleteContent' => "Server\\ContentController",
                'updateContent' => "Server\\ContentController",
                'getContent' => "Server\\ContentController",
                'getPreviews' => "Server\\ContentController",
                'addComment' => "Server\\CommentController",
                'getComments' => "Server\\CommentController",
                'getCommentCount' => "Server\\CommentController"
            );
            //Choosing controller for request
            $reflection = new \ReflectionClass($controllers[$request]);
            $controller = $reflection->newInstance();
            switch ($request) {
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
                case 'addComment':
                    $this->respond($controller->addComment($attributes));
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

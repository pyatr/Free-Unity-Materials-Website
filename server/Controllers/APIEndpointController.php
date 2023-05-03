<?php

namespace Server;

class APIEndpointController
{
    private UserController $userController;
    private ContentController $contentController;
    private CommentController $commentController;

    function __construct()
    {
        $this->userController = new UserController();
        $this->contentController = new ContentController();
        $this->commentController = new CommentController();
    }

    public function parseRequest(): void
    {
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            return;
        }
        $data = (array)json_decode(file_get_contents('php://input'));

        $request = $data['request'];
        $params = (array)$data['params'];
        if ($request != null) {
            switch ($request) {
                case 'login':
                    $this->respond($this->userController->tryLogin($params));
                    break;
                case 'loginCookie':
                    $this->respond($this->userController->tryLoginWithCookie());
                    break;
                case 'createContent':
                    $this->respond($this->contentController->createContent($params));
                    break;
                case 'deleteContent':
                    $this->respond($this->contentController->deleteContent($params));
                    break;
                case 'updateContent':
                    $this->respond($this->contentController->updateContent($params));
                    break;
                case 'getContent':
                    $this->respond($this->contentController->getContent($params));
                    break;
                case 'getPreviews':
                    $this->respond($this->contentController->getContentPreviews($params));
                    break;
                case 'addComment':
                    $this->respond($this->commentController->addComment($params));
                    break;
                case 'getComments':
                    $this->respond($this->commentController->getComments($params));
                    break;
                case 'getCommentCount':
                    $this->respond($this->commentController->getCommentCount($params));
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

<?php

namespace Server;

class API
{
    private UserController $userController;
    private ContentController $contentController;

    function __construct()
    {
        $this->userController = new UserController();
        $this->contentController = new ContentController();
    }

    public function parseRequest(): void
    {
        if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
            return;
        }
        $data = (array)json_decode(file_get_contents("php://input"));

        $request = $data["request"];
        $params = (array)$data["params"];
        if ($request != null) {
            switch ($request) {
                case "login":
                    $this->respond($this->userController->Login($params));
                    break;
                case "loginCookie":
                    $this->respond($this->userController->LoginCookie());
                    break;
                case "createPost":
                    $this->respond($this->contentController->createPost($params));
                    break;
                case "deletePost":
                    $this->respond($this->contentController->deletePost($params));
                    break;
                case "updatePost":
                    $this->respond($this->contentController->updatePost($params));
                    break;
                case "getPost":
                    $this->respond($this->contentController->getPost($params));
                    break;
                case "getPosts":
                    $this->respond($this->contentController->getPosts($params));
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

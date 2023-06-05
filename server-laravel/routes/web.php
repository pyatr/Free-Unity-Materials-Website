<?php

use Illuminate\Support\Facades\Route;

include_once '../Autoload.php';

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('content/{any}', function ($wildcard) {
    $controller = new \Server\ContentController();
    $parameters = $_GET;
    switch ($wildcard) {
        case 'create-content':
            echo json_encode($controller->createContent($parameters));
            break;
        case 'delete-content':
            echo json_encode($controller->deleteContent($parameters));
            break;
        case 'update-content':
            echo json_encode($controller->updateContent($parameters));
            break;
        case 'get-content':
            echo json_encode($controller->getContent($parameters));
            break;
        case 'get-previews':
            if (!array_key_exists('name-filter', $parameters)) {
                $parameters['name-filter'] = '';
            }
            echo json_encode($controller->getContentPreviews($parameters));
            break;
        case 'get-all-previews':
            if (!array_key_exists('name-filter', $parameters)) {
                $parameters['name-filter'] = '';
            }
            echo json_encode($controller->getAllContentPreviews($parameters));
            break;
        default:
            break;
    }
});

Route::get('comments/{any}', function ($wildcard) {
    $controller = new \Server\CommentController();
    $parameters = $_GET;
    switch ($wildcard) {
        case 'add-comment':
            echo json_encode($controller->addComment($parameters));
            break;
        case 'update-comment':
            echo json_encode($controller->updateComment($parameters));
            break;
        case 'delete-comment':
            $controller->deleteComment($parameters);
            break;
        case 'get-comments':
            echo json_encode($controller->getComments($parameters));
            break;
        case 'get-comments-count':
            echo json_encode($controller->getCommentCount($parameters));
            break;
        default:
            break;
    }
});

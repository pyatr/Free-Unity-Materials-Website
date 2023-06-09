<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

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

Auth::routes(['verify' => true]);

Route::post('content/{any}', function ($wildcard) {
    $parameters = $_POST;
    switch ($wildcard) {
        case 'create-content':
            echo json_encode(ContentController::createContent($parameters));
            break;
        case 'update-content':
            echo json_encode(ContentController::updateContent($parameters));
            break;
        case 'delete-content':
            echo json_encode(ContentController::deleteContent($parameters));
            break;
        default:
            break;
    }
});

Route::get('content/{any}', function ($wildcard) {
    $parameters = $_GET;
    switch ($wildcard) {
        case 'get-content':
            echo json_encode(ContentController::getContent($parameters));
            break;
        case 'get-previews':
            echo json_encode(ContentController::getContentPreviews($parameters));
            break;
        default:
            break;
    }
});

Route::post('comments/{any}', function ($wildcard) {
    $parameters = $_POST;
    switch ($wildcard) {
        case 'add-comment':
            echo json_encode(CommentController::addComment($parameters));
            break;
        case 'update-comment':
            echo json_encode(CommentController::updateComment($parameters));
            break;
        case 'delete-comment':
            CommentController::deleteComment($parameters);
            break;
        default:
            break;
    }
});

Route::get('comments/{any}', function ($wildcard) {
    $parameters = $_GET;
    switch ($wildcard) {
        case 'get-comments':
            echo json_encode(CommentController::getComments($parameters));
            break;
        case 'get-comments-count':
            echo json_encode(CommentController::getCommentCount($parameters));
            break;
        default:
            break;
    }
});

Route::post('user/{any}', function ($wildcard) {
    $parameters = $_POST;
    switch ($wildcard) {
        case 'register':
            return UserController::createNewUser($parameters);
        case 'activateUser':
            echo json_encode(UserController::activateUser($parameters));
            break;
        case 'sendActivationLink':
            echo json_encode(UserController::sendActivationLink($parameters));
            break;
        case 'addCodeForUserEmailChange':
            echo json_encode(UserController::addCodeForUserEmailChange($parameters));
            break;
        case 'changeUserEmail':
            echo json_encode(UserController::changeUserEmail($parameters));
            break;
        case 'checkEmailValidationCode':
            echo json_encode(UserController::checkEmailValidationCode($parameters));
            break;
        case 'checkPasswordValidationCode':
            echo json_encode(UserController::checkPasswordValidationCode($parameters));
            break;
        case 'addCodeForUserPasswordChange':
            echo json_encode(UserController::addCodeForUserPasswordChange($parameters));
            break;
        case 'changeUserPassword':
            echo json_encode(UserController::changeUserPassword($parameters));
            break;
        case 'deleteUser':
            echo json_encode(UserController::deleteUser($parameters));
            break;
        case 'login':
            echo json_encode(UserController::tryLogin($parameters));
            break;
        case 'setUserAvatar':
            UserController::setUserAvatar($parameters);
            break;
        default:
            break;
    }
});

Route::get('user/{any}', function ($wildcard) {
    $parameters = $_GET;
    switch ($wildcard) {
        case 'getPublicUserInfo':
            echo json_encode(UserController::getPublicUserInfo($parameters));
            break;
        default:
            break;
    }
});

/*
Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});
*/

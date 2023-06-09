<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <link rel="icon" href="./assets/icon.png"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content="#000000"/>
    <meta
        name="description"
        content="Login page"
    />
    <link rel="manifest" href="manifest.json"/>
    <title>Free Unity Materials - Log in</title>
</head>
<body>
<noscript>You need to enable JavaScript to run this app.</noscript>
<div class="logo">
    <img src="./assets/logo.png" width="410" height="169"/>
</div>
<div>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">
</div>

<div>
    <label for="pass">Password (8 characters minimum):</label>
    <input type="password" id="pass" name="password"
           minlength="6" required>
</div>

<input type="submit" value="Sign in">
<div id="root"></div>
</body>
</html>

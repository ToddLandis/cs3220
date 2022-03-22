<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Hearne Homepage</title>
        <link rel="stylesheet" href="./home_style.css">
    </head>
    <body>
        <div id="page-container">
            <div id="header-space">
                <div id="header-wrap">
                    <h1>Academic</h1>
                    <h1>Planning</h1>
                    <h1>Environment</h1>
                    <p class="credits">By Joshua Hearne, Todd Landis, and Ryan Carpenter</p>
                </div>
            </div>
            <div id="login-container">
                <form name="loginform" onsubmit="validate()">
                    <input id="userfield" type="text" placeholder="Username"/>
                    <input id="passfield" type="password" placeholder="Password"/>
                    <input id="submit-btn" type="submit" value="Log in"/>
                </form>
                <p id="or">or</p>
                <a href="./signup.html" id="signup">Sign up</a>
            </div>
        </div>
    </body>
</html>
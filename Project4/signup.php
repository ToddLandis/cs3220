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
            <div id="content-wrap">
                <div class="login-container">
                    <form name="signupform" onsubmit="">
                        <input id="userfield" type="text" placeholder="Username"/>
                        <input id="passfield" type="password" placeholder="Password"/>
                        <input id="namefield" type="text" placeholder="Student Name"/>
                        <input id="plannamefield" type="text" placeholder="Plan Name"/>
                        <input id="majorfield" type="text" placeholder="Student Major"/>
                        <label>Page Preference</label>
                        <input type="radio" class="option" name="mode" value="dark">Dark Mode<br>
                        <input type="radio" class="option" name="mode" value="light">Light Mode<br>
                        <input id="submit-btn" class="bottomfield" type="submit" value="Sign up"/>
                    </form>
                </div>
            </div>
        </div>
    </body>
</html>

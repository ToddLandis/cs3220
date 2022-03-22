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
                <div id="signup-container">
                    <form name="signupform" onsubmit="createplan()">
                        <input id="userfield" type="text" placeholder="Username"/>
                        <input id="passfield" type="password" placeholder="Password"/>
                        <input id="confirmpassfield" type="password" placeholder="Confirm Password"/>
                        <input id="namefield" type="text" placeholder="Student Name"/>
                        <input id="plannamefield" type="text" placeholder="Plan Name"/>
                        <select name="major" id="major" placeholder="Student Major">
                            <option value="none" selected disabled hidden>Major</option>
                            <option value="Comp. Sci.">Computer Science</option>
                            <option value="Comp. Eng.">Computer Engineering</option>
                        </select>
                        <label>Page Preference</label>
                        <label><input type="radio" class="option" name="mode" value="dark">Dark Mode<br></label>
                        <label><input type="radio" class="option" name="mode" value="light">Light Mode<br></label>
                        <input id="submit-btn" type="submit" value="Sign up"/>
                    </form>
                </div>
            </div>
        </div>
    </body>
</html>

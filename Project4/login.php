<?php
    $name = htmlspecialchars($_POST["userfield"]);
    $pass = htmlspecialchars($_POST["passfield"]);
    
    $mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');
    $stmt = $mysqli->prepare("SELECT ID, Name, Password, Dark_Mode FROM CHL_User 
        WHERE Login = ?")
        or die("Prepare error.");
    $stmt->bind_param("s", $name)
            or die('Database bind error.');

    $stmt->execute()
            or die('Database execute error.');
    $stmt->store_result();    // optional for efficiency; fetches all results
    $stmt->bind_result($ID, $fieldB, $fieldC, $Dark_Mode);
    $stmt->fetch();
    if (!(empty($pass))) {
        if ($fieldC == $pass) {
            session_start();
            $_SESSION["ID"] = $ID;
            $_SESSION["Dark_Mode"] = $Dark_Mode;
            header("Location: ./index.php");
        }
        else {
            //TODO Joshua this is right up your alley
            // Modify page to show that the wrong username/password was used.
            echo 'Username "' . $name . '" or password invalid';
            // if you need it in the html body you could set a variable here which is detected later in the page in another set of php brackets
        }
    }
    $stmt->close();
    $mysqli->close();
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Login</title>
        <link rel="stylesheet" href="./home_style.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
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
                <div id="login-container">
                    <form name="loginform" method="post" action="login.php">
                        <input name="userfield" id="userfield" type="text" placeholder="Username" value="<?php echo $name ?>"/>
                        <input name="passfield" id="passfield" type="password" placeholder="Password"/>
                        <input onsubmit="validate(); return false;" id="submit-btn" type="submit" value="Log in"/>
                    </form>
                    <p id="or">or</p>
                    <a href="./signup.php" id="signup">Sign up</a>
                </div>
            </div>
        </div>
    </body>
    <script language="javascript" type="text/javascript">
        // not used for now, direct form POSTing used.
        function validate() {
            url = 'login.php'
            data = 'user=' + $('#userfield').val() + '&pass=' + $('#passfield').val();
            console.log(data); //DEBUG
            $.ajax({
                type: "POST",
                url: url,
                data: data
            });
    </script>
</html>

<?php
    $name = htmlspecialchars($_POST["userfield"]);
    $pass = htmlspecialchars($_POST["passfield"]);
    echo "Password: " . $pass;

    $mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');
    $stmt = $mysqli->prepare("SELECT ID, Name, Password, Dark_Mode from CHL_User 
        where Name = ?")
        or die("Prepare error.");
    $stmt->bind_param("s", $name) //FIXME probably remove "ii"
            or die('Database bind error.');

    $stmt->execute()
            or die('Database execute error.');
    $stmt->store_result();    // optional for efficiency; fetches all results
    $stmt->bind_result($ID, $fieldB, $fieldC, $Dark_Mode);
    $stmt->fetch();

    if (($fieldC == $pass) && ($pass != null)) {
        session_start();
        $_SESSION["ID"] = $ID;
        $_SESSION["Dark_Mode"] = $Dark_Mode;
        header("Location: ./index.php");
    }
    $stmt->close();
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Hearne Homepage</title>
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
                    <form name="loginform" onsubmit="validate()">
                        <input name="userfield" id="userfield" type="text" placeholder="Username"/>
                        <input name="passfield" id="passfield" type="password" placeholder="Password"/>
                        <input id="submit-btn" type="submit" value="Log in"/>
                    </form>
                    <p id="or">or</p>
                    <a href="./signup.php" id="signup">Sign up</a>
                </div>
            </div>
        </div>
    </body>
    <script type="javascript">
        function validate() {
            url = 'login.php'
            data = 'user=' + $('#userfield').val() + '&pass=' + $('#passfield');
            $.ajax({
                type: "POST",
                url: url,
                data: data
            });
    </script>
</html>

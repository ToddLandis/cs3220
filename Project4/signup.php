<?php
    $user   = htmlspecialchars($_POST["userfield"]);
    $pass   = htmlspecialchars($_POST["passfield"]);
    $cpass  = htmlspecialchars($_POST["confirmpassfield"]);
    $name   = htmlspecialchars($_POST["namefield"]);
    $plan   = htmlspecialchars($_POST["plannamefield"]);
    $major  = htmlspecialchars($_POST["major"]);
    $mode    = htmlspecialchars($_POST["mode"]);
    
    // CURRENT SEMESTER: TO BE UPDATED EACH REGISTRATION PERIOD
    $cat_ID = 1;
    $year = 2022;
    $term = "Spring";

    if ($mode == 'dark') {
        $mode = true;
    }
    else {
        $mode = false;
    }

    // Check that username isn't taken
    $mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
        or die('Database connect error.');
    $stmt = $mysqli->prepare("SELECT ID FROM CHL_User WHERE Name = ?")
        or die("Prepare error.");
    $stmt->bind_param("s", $user)
            or die('Database bind error.');

    $stmt->execute()
            or die('Database execute error.');
    $stmt->store_result();  // optional for efficiency; fetches all results
    $stmt->fetch();
    if(mysql_num_rows($stmt) == 0) {
        $taken = false;
    }
    else {
        $taken = true;
    }
    $stmt->close();

    if(taken) {
        echo "Username is taken, please select a different one.";
    }
    else if (empty($user) || empty($pass) || empty($cpass) || empty($name) || empty($plan) || empty($major) || empty($major)) {
        echo "Please fill in every box.";
    }
    else if ($pass == $cpass) {
        echo "Your passwords do not match";
    }
    else {
        $mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
        or die('Database connect error.');
        $stmt = $mysqli->prepare("INSERT INTO `CHL_User` (`ID`, `Name`, `Login`, `Password`, `Dark_Mode`) 
            VALUES (NULL, ?, ?, ?, ?);
            SELECT ID FROM CHL_User WHERE Name = ?")
            or die("Prepare error.");
        $stmt->bind_param("sssbs", $name, $user, $password, $mode, $user)
                or die('Database bind error.');

        $stmt->execute()
                or die('Database execute error.');
        $stmt->store_result();  // optional for efficiency; fetches all results
        $stmt->bind_result($ID);// probably wrong, possibly more return values.
        $stmt->fetch();
        $stmt->close();


        $stmt = $mysqli->prepare("INSERT INTO `CHL_Major` (`ID`, `User_ID`, `Major`) VALUES (NULL, ?, ?)
        ")
            or die("Prepare error.");
        $stmt->bind_param("ss", $ID, $major)
                or die('Database bind error.');
        
        $stmt->execute()
                or die('Database execute error.');
        $stmt->store_result();    // optional for efficiency; fetches all results
        $stmt->bind_result($ID, $fieldB, $fieldC, $Dark_Mode);
        $stmt->fetch();
        $stmt->close();


        $stmt = $mysqli->prepare("INSERT 
            INTO `CHL_Plan` (`ID`, `User_ID`, `Catalog_ID`, `Plan_name`, `currYear`, `currTerm`, `Major`) 
            VALUES (NULL, ?, ?, ?, ?, ?, ?)
        ")
            or die("Prepare error.");
        $stmt->bind_param("sssiis", $ID, $cat_ID, $plan, $year, $term, $major)
                or die('Database bind error.');
        
        $stmt->execute()
                or die('Database execute error.');
        $stmt->close();
    }
?>

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

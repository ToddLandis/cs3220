<?php
    /* If started from the command line, wrap parameters to $_POST and $_GET 
    This is for debugging purposes. */
    if (!isset($_SERVER["HTTP_HOST"])) {
        parse_str($argv[1], $_GET);
        parse_str($argv[1], $_POST);
    }
    /**/

    $user   = htmlspecialchars($_POST["userfield"]);
    $pass   = htmlspecialchars($_POST["passfield"]);
    $cpass  = htmlspecialchars($_POST["confirmpassfield"]);
    $name   = htmlspecialchars($_POST["namefield"]);
    $plan   = htmlspecialchars($_POST["plannamefield"]);
    $major  = htmlspecialchars($_POST["major"]);
    $mode   = htmlspecialchars($_POST["mode"]);
    
    $alert = "";

    // CURRENT SEMESTER: TO BE UPDATED EACH REGISTRATION PERIOD
    $cat_ID = 1;
    $year = 2022;
    $term = "Spring";

    // Check that username isn't taken
    $mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
        or die('Database connect error.');
    $stmt = $mysqli->prepare("SELECT ID FROM CHL_User WHERE Login = ?")
        or die("Prepare error.");
    $stmt->bind_param("s", $user)
            or die('Database bind error.');

    $stmt->execute();
    $stmt->store_result();  // optional for efficiency; fetches all results
    $stmt->fetch();
    
    if($stmt->num_rows == 0) {
        $taken = false;
    }
    else {
        $taken = true;
    }
    $stmt->close();
    $mysqli->close();

    if (empty($user) || empty($pass) || empty($cpass) || empty($name) || empty($plan) || empty($major) || empty($major)) {
        if (!(empty($user) && empty($pass) && empty($cpass) && empty($name) && empty($plan) && empty($major) && empty($major))) {
            $alert .= "Please fill in every box.";
        }
    }
    elseif ($taken) {
        $alert .= "Username is taken, please select a different one.";
    }
    elseif ($pass != $cpass) {
        $alert .= "Your passwords do not match";
    }
    else {
        $mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
            or die('Database connect error.');
        
     //   $mysqli->begin_transaction();

        $stmt = $mysqli->prepare("INSERT INTO `CHL_User` (`ID`, `Name`, `Login`, `Password`, `Dark_Mode`) VALUES (NULL, ?, ?, ?, ?);")
            or die("Prepare error.");
        $stmt->bind_param("ssss", $name, $user, $pass, $mode)
                or die('Database bind error.');
        $stmt->execute();
        
        $stmt->close();

        $stmt = $mysqli->prepare("SELECT ID FROM CHL_User WHERE Name = ?")
            or die("Prepare error.");
        $stmt->bind_param("s", $user)
                or die('Database bind error.');
        $stmt->execute();
        $stmt->store_result();  // optional for efficiency; fetches all results
        $stmt->bind_result($ID);// probably wrong, possibly more return values.
        $stmt->fetch();
        $stmt->close();


        $stmt = $mysqli->prepare("INSERT INTO `CHL_Major` (`ID`, `User_ID`, `Major`) VALUES (NULL, ?, ?);")
            or die("Prepare error.");
        $stmt->bind_param("ss", $ID, $major)
                or die('Database bind error.');
        
        $stmt->execute();
        $stmt->close();


        $stmt = $mysqli->prepare("INSERT 
            INTO `CHL_Plan` (`ID`, `User_ID`, `Catalog_ID`, `Plan_name`, `currYear`, `currTerm`, `Major`) 
            VALUES (NULL, ?, ?, ?, ?, ?, ?);")
            or die("Prepare error.");
        $stmt->bind_param("sssiis", $ID, $cat_ID, $plan, $year, $term, $major)
                or die('Database bind error.');
        
        $stmt->execute();
        $stmt->close();
    //    $mysqli->commit();
        $mysqli->close();

        header("Location: ./login.php");
    }
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Signup</title>
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
                <div id="signup-container">
                    <form name="signupform" method="post" action="signup.php">
                        <input id="userfield" name="userfield" type="text" placeholder="Username" value="<?= $user ?>"/>
                        <input id="passfield" name="passfield"  type="password" placeholder="Password"/>
                        <input id="confirmpassfield" name="confirmpassfield" type="password" placeholder="Confirm Password"/>
                        <input id="namefield" name="namefield" type="text" placeholder="Student Name" value="<?= $name ?>"/>
                        <input id="plannamefield" name="plannamefield" type="text" placeholder="Plan Name" value="<?= $plan ?>"/>
                        <select name="major" id="major" placeholder="Student Major">
                            <option value="none" selected disabled hidden>Major</option>
                            <option value="Comp. Sci." <?php if ($major == 'Comp. Sci.') echo 'selected'; ?> >Computer Science</option>
                            <option value="Comp. Eng." <?php if ($major == 'Comp. Eng.') echo 'selected'; ?> >Computer Engineering</option>
                        </select>
                        <label>Page Preference</label>
                        <label><input type="radio" class="option" name="mode" value="dark" <?php if ($mode == 'dark') echo 'checked'; ?> >Dark Mode<br></label>
                        <label><input type="radio" class="option" name="mode" value="light" <?php if ($mode == 'light') echo 'checked'; ?> >Light Mode<br></label>
                        <input id="submit-btn" type="submit" value="Sign up"/>
                    </form>
                </div>
            </div>
        </div>
    </body>
</html>
<?php
        if ($alert != "") {
            echo '<script type="text/JavaScript">$( document ).ready(function() { setTimeout(function () {  alert("' . $alert . '") }, 500); });</script>';
        }
?>
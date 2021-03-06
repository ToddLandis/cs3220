<?php
    $name = htmlspecialchars($_POST["userfield"]);
    $pass = htmlspecialchars($_POST["passfield"]);
    //$name = 'Admin'; //DEBUG
    $return = array();

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
    $stmt->bind_result($ID, $Name, $Password, $Dark_Mode);
    $stmt->fetch();
    if ($pass == $Password) {
        $return['ID'] = $ID;
        $return['Username'] = $Name;
        $return['Dark_Mode'] = $Dark_Mode;
        $return['ajaxpass'] = $pass;
        $return['sqlpass'] = $Password;
    }
    $stmt->close();
    $mysqli->close();

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS, POST, PUT');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($return);
?>

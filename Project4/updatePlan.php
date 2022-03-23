<?php
session_start();
$ID = $_SESSION["ID"];
$data = json_decode($_POST["myData"]);

// POST JSON to Array (hopefully?)

$mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');
    //transaction
for (i in $data) {
    //FIXME
    $change = $data[i].change;
    $course = $data[i].course;
    $term   = $data[i].term;
    $year   = $data[i].year;

    if ($change = 'insert') {
    $stmt = $mysqli->prepare("INSERT INTO `Plan_Courses` (`ID`, `Name`, `Login`, `Password`, `Dark_Mode`) VALUES (NULL, ?, ?, ?, ?);")
            or die("Prepare error.");
    $stmt->bind_param("ssss", $name, $user, $pass, $mode)
            or die('Database bind error.');
    $stmt->execute();
        
    $stmt->close();
    }
    else if ($change = 'delete') {
        $stmt = $mysqli->prepare("DELETE FROM `CHL_User` (`ID`, `Name`, `Login`, `Password`, `Dark_Mode`) VALUES (NULL, ?, ?, ?, ?);")
            or die("Prepare error.");
        $stmt->bind_param("ssss", $name, $user, $pass, $mode)
                or die('Database bind error.');
        $stmt->execute();
            
        $stmt->close();
    }
    else {
        // This means broken code
        echo $change;
    }
}
//transaction
$mysqli->close();
?>
<?php
session_start();
$ID = $_SESSION["ID"];
$data = json_decode($_POST["myData"]);

// POST JSON to Array (hopefully?)

$mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');
    //transaction
for (i in $data) {
    $change = $data[i].change;
    $plan   = $data[i].plan;    //TODO Make sure this is Plan_ID
    $course = $data[i].course;  //TODO Make sure this is course_designator
    $year   = $data[i].year;
    $term   = $data[i].term;

    // Convert Plan_name to Plan_ID
    /*
    $stmt = $mysqli->prepare("SELECT `ID` from `CHL_Plan` 
        where `User_ID` = ? AND `plan_name` = ?")
        or die("Prepare error.");
    $stmt->bind_param("ss", $ID, $plan)
            or die('Database bind error.');
    $stmt->execute()
            or die('Database execute error.');
    $stmt->store_result();
    $stmt->bind_result($plan);
    $stmt->fetch();
    $stmt->close();
    */
    // Convert Course_Designator to Course_ID
    $stmt = $mysqli->prepare("SELECT `ID` from `CHL_Course` 
        where `Designator` = ?")
        or die("Prepare error.");
    $stmt->bind_param("i", $course)
            or die('Database bind error.');
    $stmt->execute()
            or die('Database execute error.');
    $stmt->store_result();
    $stmt->bind_result($course);
    $stmt->fetch();
    $stmt->close();

    if ($change = 'insert') {
    $stmt = $mysqli->prepare("INSERT INTO `Plan_Courses` (`ID`, `Plan_ID`, `Course_ID`, `Year`, `Semester`) VALUES (NULL, ?, ?, ?, ?);")
            or die("Prepare error.");
    $stmt->bind_param("ssis", $plan, $course, $year, $term) //FIXME if i doesn't work, either convert year to int or see if database will convert it if you change i to s
            or die('Database bind error.');
    $stmt->execute();
        
    $stmt->close();
    }
    else if ($change = 'delete') {
        $stmt = $mysqli->prepare("DELETE FROM `CHL_Plan_Courses` WHERE `CHL_Plan_Courses`.`Plan_ID` = ? AND `CHL_Plan_Courses`.`Course_ID` = ?")
            or die("Prepare error.");
        $stmt->bind_param("ss", $plan, $course)
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
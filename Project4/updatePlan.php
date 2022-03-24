<?php
/* If started from the command line, wrap parameters to $_POST and $_GET 
    This is for debugging purposes. */
    if (!isset($_SERVER["HTTP_HOST"])) {
        parse_str($argv[1], $_GET);
        parse_str($argv[1], $_POST);
    }
    /**/
session_start();
$ID = $_SESSION["ID"];
$data = json_decode($_POST["myData"]);
echo 'JSON: '.$_POST["myData"];
echo 'Raw: '.$data;
// POST JSON to Array (hopefully?)

$mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');
    //transaction
for ($i=0; $i < count($data); $i++) {
    $change = $data[$i]->change;
    $plan   = $data[$i]->plan;
    $course = $data[$i]->course;
    $year   = $data[$i]->year;
    $term   = $data[$i]->term;

    if (($term == "Spring") || ($term == "Fall")){
        $year++;
    }

    // Convert Plan_name to Plan_ID
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
    $stmt = $mysqli->prepare("INSERT INTO `CHL_Plan_Courses` (`ID`, `Plan_ID`, `Course_ID`, `Year`, `Semester`) VALUES (NULL, ?, ?, ?, ?);")
            or die("Prepare error.");
    $stmt->bind_param("iiis", $plan, $course, $year, $term) //FIXME if i doesn't work, either convert year to int or see if database will convert it if you change i to s
            or die('Database bind error.');
    $stmt->execute();
        
    $stmt->close();
    }
    elseif ($change = 'delete') {
        $stmt = $mysqli->prepare("DELETE FROM `CHL_Plan_Courses` WHERE `CHL_Plan_Courses`.`Plan_ID` = ? AND `CHL_Plan_Courses`.`Course_ID` = ?")
            or die("Prepare error.");
        $stmt->bind_param("ii", $plan, $course)
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
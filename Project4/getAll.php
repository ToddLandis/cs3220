<?php
$mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');

// Arguments
$ID = htmlspecialchars($_GET["ID"]);
$ID = 1; //DEBUG
//$password = htmlspecialchars($_GET["pass"]); //FIXME session key

// Return array
$combined = array();



$year = 2018;   // get from Plan
$major=1;  // id field for CS major; get from Plan


$stmt = $mysqli->prepare("SELECT ID, Name, Dark_Mode from CHL_User 
        where ID = ?")
        or die("Prepare error.");
$stmt->bind_param("i", $ID) //FIXME probably remove "ii"
        or die('Database bind error.');

$stmt->execute()
        or die('Database execute error.');
$stmt->store_result();    // optional for efficiency; fetches all results
$stmt->bind_result($fieldA, $fieldB, $fieldC);

$user = array();
    $user['ID'] = $fieldA;
    $user['Name'] = $fieldB;
    $user['Dark_Mode'] = $fieldC;
$stmt->close();


$stmt = $mysqli->prepare("SELECT ID, User_ID, Catalog_ID, Plan_Name, currYear, currTerm from CHL_Plan
        where User_ID = ?");
$stmt->bind_param("i", $ID)
        or die('Database bind error.');

$stmt->execute()
        or die('Database execute error.');
$stmt->store_result();    // optional for efficiency; fetches all results
$stmt->bind_result($fieldA, $fieldB, $fieldC, $fieldD, $fieldE, $fieldF);

$plans = array();
while ($stmt->fetch()) {
    array_push($plans, ['ID'=>$fieldA, 'User_ID'=>$fieldB, 'Catalog_ID'=>$fieldC, 'Plan_Name'=>$fieldD, 'currYear'=>$fieldE, 'currTerm'=>$fieldF]);
}
$stmt->close();

for ($i = 0; $i < count($plan); $i++) {
        $stmt = $mysqli->prepare("SELECT ID, Plan_ID, Course_ID, Year, Semester from CHL_Plan_Courses
                where Plan_ID = ?");
        $stmt->bind_param("i", $plan[i]['ID'])
                or die('Database bind error.');

        $stmt->execute()
                or die('Database execute error.');
        $stmt->store_result();    // optional for efficiency; fetches all results
        $stmt->bind_result($fieldA, $fieldB, $fieldC, $fieldD, $fieldE);

        $plan_courses = array();
        while ($stmt->fetch()) {
                array_push($courses, ['ID'=>$fieldA, 'Plan_ID'=>$fieldB, 'Course_ID'=>$fieldC, 'year'=>$fieldD, 'term'=>$fieldE]);
        }
        $plan[i]['courses'] = $plan_courses;
        $stmt->close();
}


// top level
$combined['plans'] = $plans; //modified from 'plan'
$combined['catalog'] = $catalog;
$combined['Requirements'] = $requirements;
$combined['User'] = $user;
$combined['PlanList'] = $planList; //dontneed

$mysqli->close();
echo json_encode($combined);
?>
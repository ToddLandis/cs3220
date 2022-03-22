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


// user
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


// plans
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

for ($i = 0; $i < count($plans); $i++) {
        $stmt = $mysqli->prepare("SELECT ID, Plan_ID, Course_ID, Year, Semester from CHL_Plan_Courses 
                where Plan_ID = ?");
        $stmt->bind_param("i", $plans[i]['ID'])
                or die('Database bind error.');

        $stmt->execute()
                or die('Database execute error.');
        $stmt->store_result();    // optional for efficiency; fetches all results
        $stmt->bind_result($fieldA, $fieldB, $fieldC, $fieldD, $fieldE);

        $plan_courses = array();
        while ($stmt->fetch()) {
                array_push($courses, ['ID'=>$fieldA, 'Plan_ID'=>$fieldB, 'Course_ID'=>$fieldC, 'year'=>$fieldD, 'term'=>$fieldE]);
        }
        $plans[i]['courses'] = $plan_courses;
        $stmt->close();
}


// catalog
$stmt = $mysqli->prepare("SELECT Catalog_ID, Course_ID, Year, Designator, Title, Description, Credits from CHL_Catalog_Courses,CHL_Catalog,CHL_Course
        where CHL_Catalog_Courses.Catalog_ID = CHL_Catalog.ID AND CHL_Catalog_Courses.Course_ID = CHL_Course.ID AND Year = ?");
$stmt->bind_param("i", $year)
        or die('Database bind error.');

$stmt->execute()
        or die('Database execute error.');
$stmt->store_result();    // optional for efficiency; fetches all results
$stmt->bind_result($fieldA, $fieldB, $fieldC, $fieldD, $fieldE, $fieldF, $fieldG);

$catalog = array();
while ($stmt->fetch()) {
    array_push($catalog, ['id'=>$fieldD, 'name'=>$fieldE, 'description'=>$fieldF, 'credits'=>$fieldG]);
}
$stmt->close();

// top level
$combined['plans'] = $plans; //modified from 'plan'
$combined['catalog'] = $catalog;
$combined['Requirements'] = $requirements;
$combined['User'] = $user;
$combined['PlanList'] = $planList; //dontneed

$mysqli->close();
echo json_encode($combined);
?>
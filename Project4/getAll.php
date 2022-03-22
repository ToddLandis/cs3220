<?php
$mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');

// Arguments
//session_start(); // This will directly bring in variables referenced like "$ID"
$ID = 1; //DEBUG
//$password = htmlspecialchars($_GET["pass"]); //FIXME session key

// Return array
$combined = array();


//FIXME move to // plans and get from SQL
$year = 2020;   // get from Plan
$major=1;  // id field for CS major; get from Plan FIXME


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
$stmt->fetch();

$user = array();
    $user['ID'] = $fieldA;
    $user['Name'] = $fieldB;
    $user['Dark_Mode'] = $fieldC;
$stmt->close();


// plans
$stmt = $mysqli->prepare("SELECT CHL_Plan.ID, Name, User_ID, Catalog_ID, Plan_Name, currYear, currTerm, Major from CHL_Plan,CHL_User
        where CHL_Plan.User_ID = CHL_User.ID AND User_ID = ?");
$stmt->bind_param("i", $ID)
        or die('Database bind error.');

$stmt->execute()
        or die('Database execute error.');
$stmt->store_result();    // optional for efficiency; fetches all results
$stmt->bind_result($fieldA, $fieldB, $fieldC, $fieldD, $fieldE, $fieldF, $fieldG, $fieldH);

$plans = array();
while ($stmt->fetch()) {
    array_push($plans, ['ID'=>$fieldA, 'User_name'=>$fieldB, 'User_ID'=>$fieldC, 'Catalog_ID'=>$fieldD, 'Plan_Name'=>$fieldE, 'currYear'=>$fieldF, 'currTerm'=>$fieldG, 'major'=>$fieldH]);
}
$stmt->close();

for ($i = 0; $i < count($plans); $i++) {
        $stmt = $mysqli->prepare("SELECT Course_ID, Designator, Title, Year, Semester from CHL_Plan_Courses,CHL_Course 
                where CHL_Plan_Courses.Course_ID = CHL_Course.ID AND Plan_ID = ?");
        $stmt->bind_param("s", $plans[$i]['ID'])
                or die('Database bind error.');

        $stmt->execute()
                or die('Database execute error.');
        $stmt->store_result();    // optional for efficiency; fetches all results
        $stmt->bind_result($fieldA, $fieldB, $fieldC, $fieldD, $fieldE);

        $plan_courses = array();
        while ($stmt->fetch()) {
                array_push($plan_courses, ['DBID'=>$fieldA, 'id'=>$fieldB, 'name'=>$fieldC, 'year'=>$fieldD, 'term'=>$fieldE]);
        }
        $plans[$i]['courses'] = $plan_courses;
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

$catalog['courses'] = array();
while ($stmt->fetch()) {
    $catalog['courses'][$fieldB] = ['id'=>$fieldD, 'name'=>$fieldE, 'description'=>$fieldF, 'credits'=>$fieldG];
}
$stmt->close();


// requirements
$stmt = $mysqli->prepare("SELECT CHL_Course.Designator, CHL_Course.Title, CHL_Category.Name from CHL_Category_Courses,CHL_Category,CHL_Requirements,CHL_Course 
        where CHL_Category_Courses.Category_ID = CHL_Category.ID AND CHL_Category.Req_ID = CHL_Requirements.ID AND CHL_Category_Courses.Course_ID = CHL_Course.ID AND Major = ?");
$stmt->bind_param("s", $major)
        or die('Database bind error.');

$stmt->execute()
        or die('Database execute error.');
$stmt->store_result();    // optional for efficiency; fetches all results
$stmt->bind_result($fieldA, $fieldB, $fieldC);

$requirements = array();
while ($stmt->fetch()) {
        array_push($requirements[$fieldC], ['id'=>$fieldA, 'Title'=>$fieldB, 'category'=>$fieldC]);
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

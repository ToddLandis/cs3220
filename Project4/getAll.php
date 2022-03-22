<?php
$mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');

// Arguments
$ID = htmlspecialchars($_GET["ID"]);
//$password = htmlspecialchars($_GET["pass"]); //FIXME session key

// Return array
$combined = array();



$year = 2018;   // get from Plan
$major=1;  // id field for CS major; get from Plan


$stmt = $mysqli->prepare("SELECT ID, Name, Dark_Mode from CHL_User 
        where ID = ?")
        or die("Prepare error.");
$stmt->bind_param($ID) //FIXME probably remove "ii"
        or die('Database bind error.');

$stmt->execute()
        or die('Database execute error.');
$stmt->store_result();    // optional for efficiency; fetches all results
$stmt->bind_result($fieldA, $fieldB, $fieldC);

$user = array();
while ($stmt->fetch()) { //FIXME shouldn't need loop in this instance
    array_push($user, $fieldA, $fieldB, $fieldC);
}
$stmt->close();


$stmt = $mysqli->prepare("SELECT ID, User_ID, Catalog_ID, Plan_Name from CHL_Plan
        where User_ID = ?");
$stmt->bind_param($ID)
        or die('Database bind error.');

$stmt->execute()
        or die('Database execute error.');
$stmt->store_result();    // optional for efficiency; fetches all results
$stmt->bind_result($fieldA, $fieldB, $fieldC, $fieldD);

$plan = array();
while ($stmt->fetch()) {
    array_push($plan, $fieldA, $fieldB, $fieldC, $fieldD);
}
$stmt->close();

// top level
$combined['plan'] = $plan;
$combined['catalog'] = $catalog;
$combined['Requirements'] = $requirements;
$combined['User'] = $user;
$combined['PlanList'] = $planList;

$mysqli->close();
echo json_encode($combined);
?>
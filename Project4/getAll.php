<?php
$mysqli = new mysqli('james', 'cs3220', '', 'cs3220_Sp22') 
    or die('Database connect error.');

// Arguments
$name = htmlspecialchars($GET["name"]);
$password = htmlspecialchars($GET["pass"]); //FIXME session key

// Return array
$combined = array();

// top level
$combined['plan'] = $plan;
$combined['catalog'] = $catalog;
$combined['Requirements'] = $requirements;
$combined['User'] = $user;
$combined['PlanList'] = $planList;

$year = 2018;   // get from Plan
$major=1;  // id field for CS major; get from Plan

$stmt = mysqli->prepare("SELECT fieldA, fieldB from Requirements 
        where year= ? AND  major= ?;");
$stmt->bind_param("ii", $year, $major)
        or die('Database bind error.');

$stmt->execute()
        or die('Database execute error.');
$stmt->store_result();    // optional for efficiency; fetches all results
$stmt->bind_result($fieldA, $fieldB);

$reqs = array();
while ($stmt->fetch()) {
    $reqs[] = new Requirement($fieldA, $fieldB);
}

$stmt->close();


$mysqli->close();
echo json_encode($combined);
?>
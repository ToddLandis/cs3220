<?php
    $db = mysqli_connect("james","cs3220","","cs3220_Sp22") or die ("Error: Unable to connected to database");
    $query = "SELECT * FROM `CHL_User` WHERE 1";
    $result = mysqli_query($db, $query) or die ("Error: Unsuccessful query");

    // $row = mysqli_fetch_assoc($result); // Hash where values can be accessed using column names
    print "Student Names";
    for ($rowNum = 0; $rowNum < mysqli_num_rows($result); $rowNum++) {
        $row = mysqli_fetch_assoc($result);
        print htmlspecialchars($row["Name"]);
        print "\n";
    }
    mysqli_close($db);
?>
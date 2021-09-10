<?php
if ($_POST) {
    include 'conn.php';
    $company_id = $_POST["company_id"];
    $isPassed = $_POST["isPassed"];
    $sql = "UPDATE company SET isPassed = '$isPassed' WHERE company_id = '$company_id'";
    if ($_POST["num"] == 'many') {
        $sql = "UPDATE company SET isPassed = '$isPassed' WHERE company_id in$company_id";
    }

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn)) {
            echo "ok";
        } else {
            echo "exist";
        }
    } else {
        echo "error";
        echo mysqli_error($conn);
    }
    mysqli_close($conn);
}

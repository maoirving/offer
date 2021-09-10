<?php
if ($_POST) {
    include 'conn.php';
    $resume_id = $_POST["resume_id"];
    $isPassed = $_POST["isPassed"];
    $sql = "UPDATE resume SET isPassed = '$isPassed' WHERE resume_id = '$resume_id'";
    if ($_POST["num"] == 'many') {
        $sql = "UPDATE resume SET isPassed = '$isPassed' WHERE resume_id in$resume_id";
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

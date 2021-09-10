<?php
include 'conn.php';
$job_id = $_GET["job_id"];
$sql = "DELETE FROM job WHERE job_id = '$job_id'";
if ($_GET["num"] == 'many') {
    $sql = "DELETE FROM job WHERE job_id in$job_id";
}
if (mysqli_query($conn, $sql)) {
    if (mysqli_affected_rows($conn)) {
        echo "ok";
    } else {
        echo "error";
    }
} else {
    echo "error";
}
mysqli_close($conn);
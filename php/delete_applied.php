<?php
include 'conn.php';
$username = $_COOKIE["username"];

$applied_id = $_GET['applied_id'];
$sql = "DELETE FROM applied WHERE applied_id = '$applied_id'";
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

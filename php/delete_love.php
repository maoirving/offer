<?php
include 'conn.php';
$username = $_COOKIE["username"];

$love_id = $_GET['love_id'];
$sql = "DELETE FROM love WHERE love_id = '$love_id'";
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

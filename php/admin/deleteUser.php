<?php
include 'conn.php';
$user_id = $_GET["user_id"];
$sql = "DELETE FROM users WHERE user_id = '$user_id'";
if ($_GET["num"] == 'many') {
    $sql = "DELETE FROM users WHERE user_id in$user_id";
}
if (mysqli_query($conn, $sql)) {
    if (mysqli_affected_rows($conn)) {
        echo "ok";
    } else {
        echo "error";
    }
} else {
    echo "error";
    echo mysqli_error($conn);
}
mysqli_close($conn);
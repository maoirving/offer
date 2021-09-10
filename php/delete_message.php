<?php
include 'conn.php';
$message_id = $_GET["message_id"];
$sql = "DELETE FROM worker_message WHERE message_id = '$message_id'";
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
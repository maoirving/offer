<?php
if ($_POST) {
    include 'conn.php';
    $applied_id = $_POST["applied_id"];
    $read_time = $_POST["read_time"];
    $sql = "UPDATE applied 
                SET isRead = 1, 
                read_time = '$read_time'
                WHERE
                	applied_id = '$applied_id'";
    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn)) {
            echo "ok";
        } else {
            echo "exist";
        }
    } else {
        echo "error";
    }
    mysqli_close($conn);
}

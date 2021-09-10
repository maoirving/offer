<?php
if ($_POST) {
    include 'conn.php';
    $applied_id = $_POST["applied_id"];
    $sql = "UPDATE applied SET isHandle = 2 WHERE applied_id = '$applied_id'";
    if ($_POST["num"] == 'many') {
        $sql = "UPDATE applied SET isHandle = 2 WHERE applied_id in $applied_id";
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

<?php
if ($_POST) {
    include 'conn.php';
    $username = $_COOKIE["username"];
    $worker_name = $_POST["worker_name"];
    $worker_sex = $_POST["worker_sex"];
    $worker_birthday = $_POST["worker_birthday"];
    $worker_phone = $_POST["worker_phone"];
    $worker_email = $_POST["worker_email"];
    $worker_address = $_POST["worker_address"];
    $sql = "UPDATE worker SET worker_name = '$worker_name', worker_sex = '$worker_sex', worker_birthday = '$worker_birthday', worker_phone='$worker_phone', worker_email='$worker_email', worker_address = '$worker_address' WHERE username = '$username'";
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

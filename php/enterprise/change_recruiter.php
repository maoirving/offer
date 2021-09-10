<?php
if ($_POST) {
    include 'conn.php';
    $recruiter_username = $_COOKIE["recruiter_username"];
    $recruiter_name = $_POST["recruiter_name"];
    $recruiter_type = $_POST["recruiter_type"];
    $recruiter_sex = $_POST["recruiter_sex"];
    $recruiter_birthday = $_POST["recruiter_birthday"];
    $recruiter_phone = $_POST["recruiter_phone"];
    $recruiter_email = $_POST["recruiter_email"];
    $sql = "UPDATE recruiter SET recruiter_name = '$recruiter_name', recruiter_type = '$recruiter_type', recruiter_sex = '$recruiter_sex', recruiter_birthday = '$recruiter_birthday', recruiter_phone='$recruiter_phone', recruiter_email='$recruiter_email' WHERE username = '$recruiter_username'";
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

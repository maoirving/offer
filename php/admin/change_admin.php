<?php
if ($_POST) {
    include 'conn.php';
    $admin_username = $_COOKIE["admin_username"];
    $admin_name = $_POST["admin_name"];
    $admin_type = $_POST["admin_type"];
    $admin_sex = $_POST["admin_sex"];
    $admin_birthday = $_POST["admin_birthday"];
    $admin_phone = $_POST["admin_phone"];
    $admin_email = $_POST["admin_email"];
    $sql = "UPDATE admin SET admin_name = '$admin_name', admin_type = '$admin_type', admin_sex = '$admin_sex', admin_birthday = '$admin_birthday', admin_phone='$admin_phone', admin_email='$admin_email' WHERE username = '$admin_username'";
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

<?php
include 'conn.php';
$username = $_COOKIE["username"];
$resume_fileUrl = "";
if ($_FILES["file"]["error"] > 0) {
    echo "错误：" . $_FILES["file"]["error"] . "<br>";
} else {
    $uploadDir = '../upload/resume/';
    $dir = dirname(__FILE__) . '/' . $uploadDir;
    file_exists($dir) || (mkdir($dir, 0777, true) && chmod($dir, 0777));
    if (!is_array($_FILES["file"]["name"])) //single file
    {
        $fileName = time() . uniqid() . '.' . pathinfo($_FILES["file"]["name"])['extension'];
        move_uploaded_file($_FILES["file"]["tmp_name"], $dir . $fileName);
        $resume_fileUrl = 'upload/resume/' . $fileName;
    }
    $sql = "UPDATE resume SET resume_fileUrl = '$resume_fileUrl' WHERE username = '$username'";
    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn)) {
            echo "ok";
        } else {
            echo "exist";
        }
    } else {
        echo "error";
    }

}
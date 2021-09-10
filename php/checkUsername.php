<?php
include 'conn.php';
$username = $_GET["username"];
$sql = "select * from users where username='$username'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
if (!$result) {
    die('无法读取数据: ' . mysqli_error($conn));
}
if (mysqli_num_rows($result)) {
    echo "error";
} else {
    echo "ok";
}
mysqli_close($conn);
<?php
$servername = "localhost";
$username = "root";
$password = "123456";
$dbname = "myoffer";
// 创建连接
$conn = mysqli_connect($servername, $username, $password, $dbname);
// 检测连接
if (!$conn) {
    die("连接失败: " . mysqli_connect_error());
}
// 设置编码，防止中文乱码
mysqli_query($conn, "set names utf8");
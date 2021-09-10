<?php
include 'conn.php';
$json = '';
$data = array();
$admin_username = $_COOKIE["admin_username"];

class Admin
{
    public $user_imgUrl;
    public $admin_name;
    public $admin_type;
    public $admin_sex;
    public $admin_birthday;
    public $admin_phone;
    public $admin_email;
}

$sql = "SELECT * FROM admin WHERE username = '$admin_username'";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $admin = new Admin();
        $admin->user_imgUrl = $row["user_imgUrl"];
        $admin->admin_name = $row["admin_name"];
        $admin->admin_type = $row["admin_type"];
        $admin->admin_sex = $row["admin_sex"];
        $admin->admin_birthday = $row["admin_birthday"];
        $admin->admin_phone = $row["admin_phone"];
        $admin->admin_email = $row["admin_email"];
    }
    $data[] = $admin;
    $json = json_encode($data);
    echo "{" . '"admin"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

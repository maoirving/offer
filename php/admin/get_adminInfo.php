<?php
include 'conn.php';
$json = '';
$data = array();
$username = $_COOKIE["admin_username"];
$admin_id = "";

class User
{
    public $user_imgUrl;
    public $admin_name;
}

$sql = "SELECT * FROM admin WHERE username = '$username'";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $user = new User();
        $user->user_imgUrl = $row["user_imgUrl"];
        $user->admin_name = $row["admin_name"];
        $admin_id = $row["admin_id"];
        $data[] = $user;
    }
    $expire = time() + 60 * 60 * 24 * 1;
    setcookie("admin_id", $admin_id, $expire, "/");
    $json = json_encode($data);
    echo "{" . '"user"' . ":" . $json . "}";
} else {
    echo "error";
}

mysqli_close($conn);

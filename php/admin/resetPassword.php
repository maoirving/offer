<?php
include 'conn.php';
$user_id = $_GET["user_id"];
$new_password = '123456';
$pwd = password($new_password);
$encrypt = $pwd['encrypt'];
$password = $pwd['password'];
$sql = "UPDATE users SET `password` = '$password', encrypt = '$encrypt' WHERE user_id = '$user_id'";
if ($_GET["num"] == 'many') {
    $sql = "UPDATE users SET `password` = '$password', encrypt = '$encrypt' WHERE user_id in$user_id";
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
/**
 * 对用户的密码进行加密
 * @param $password
 * @param $encrypt //传入加密串，在修改密码时做认证
 * @return array/password
 */
function password($password, $encrypt = '')
{
    $pwd = array();
    $pwd['encrypt'] = $encrypt ? $encrypt : create_randomstr();
    $pwd['password'] = md5(md5(trim($password)) . $pwd['encrypt']);
    return $encrypt ? $pwd['password'] : $pwd;
}

/**
 * 生成随机字符串
 * @param string $lenth 长度
 * @return string 字符串
 */
function create_randomstr($length = 6)
{
    $chars = '123456789abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ';
    $hash = '';
    $max = strlen($chars) - 1;
    mt_srand();
    for ($i = 0; $i < $length; $i++) {
        $hash .= $chars[mt_rand(0, $max)];
    }
    return $hash;
}
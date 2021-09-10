<?php
if ($_POST) {
    include 'conn.php';
    $username = trim($_POST['username']);
    $user_type = $_POST['identity'];
    $password = $_POST['password'];
    $register_time = $_POST['register_time'];
    $pwd = password($password);
    $encrypt = $pwd['encrypt'];
    $password = $pwd['password'];
    $sql = "insert into users (username, user_type, encrypt, password,register_time) values ('$username', '$user_type', '$encrypt', '$password','$register_time')";
    if (mysqli_query($conn, $sql)) {
        echo "ok";
    } else {
        echo "error";
    }
    mysqli_close($conn);
}
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

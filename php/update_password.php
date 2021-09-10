<?php
if ($_POST) {
    include 'conn.php';
    $user_type = $_POST["user_type"];
    if ($user_type == "worker") {
        $username = $_COOKIE["username"];
    }
    if ($user_type == "recruiter") {
        $username = $_COOKIE["recruiter_username"];
    }
    if ($user_type == "admin") {
        $username = $_COOKIE["admin_username"];
    }
    $new_password = $_POST["new_password"];
    $pwd = password($new_password);
    $encrypt = $pwd['encrypt'];
    $password = $pwd['password'];
    $sql = "UPDATE users SET password = '$password', encrypt = '$encrypt' WHERE username = '$username' AND user_type = '$user_type'";
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

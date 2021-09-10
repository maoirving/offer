<?php
if ($_POST) {
    include 'conn.php';
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $user_type = $_POST['user_type'];
    $encrypt = "";
    $true_password = "";
    $sql = "select * from users where username='$username' and user_type='$user_type'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        // 输出数据
        while ($row = mysqli_fetch_assoc($result)) {
            $encrypt = $row["encrypt"];
            $true_password = $row["password"];
        }
        if ($true_password == password($password, $encrypt)) {
            $expire = time() + 60 * 60 * 24 * 1;
            if ($user_type == "worker") {
                setcookie("username", $username, $expire, "/");
            }
            if ($user_type == "recruiter") {
                setcookie("recruiter_username", $username, $expire, "/");
            }
            if ($user_type == "admin") {
                setcookie("admin_username", $username, $expire, "/");
            }
            echo "ok";
        }
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


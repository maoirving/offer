<?php
include 'conn.php';
$json = '';
$data = array();
$username = $_COOKIE["recruiter_username"];
$company_id = "";
$recruiter_id = "";

class User
{
    public $user_imgUrl;
    public $recruiter_name;
}

$sql = "SELECT * FROM recruiter WHERE username = '$username'";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $user = new User();
        $user->user_imgUrl = $row["user_imgUrl"];
        $user->recruiter_name = $row["recruiter_name"];
        $recruiter_id = $row["recruiter_id"];
        $company_id = $row["company_id"];
        $data[] = $user;
    }
    $expire = time() + 60 * 60 * 24 * 1;
    setcookie("recruiter_id", $recruiter_id, $expire, "/");
    setcookie("company_id", $company_id, $expire, "/");
    $json = json_encode($data);
    echo "{" . '"user"' . ":" . $json . "}";
} else {
    echo "error";
}

mysqli_close($conn);

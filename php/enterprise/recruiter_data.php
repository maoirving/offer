<?php
include 'conn.php';
$json = '';
$data = array();
$recruiter_username = $_COOKIE["recruiter_username"];

class Recruiter
{
    public $user_imgUrl;
    public $recruiter_name;
    public $recruiter_type;
    public $recruiter_sex;
    public $recruiter_birthday;
    public $recruiter_phone;
    public $recruiter_email;
}

$sql = "SELECT * FROM recruiter WHERE username = '$recruiter_username'";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $recruiter = new Recruiter();
        $recruiter->user_imgUrl = $row["user_imgUrl"];
        $recruiter->recruiter_name = $row["recruiter_name"];
        $recruiter->recruiter_type = $row["recruiter_type"];
        $recruiter->recruiter_sex = $row["recruiter_sex"];
        $recruiter->recruiter_birthday = $row["recruiter_birthday"];
        $recruiter->recruiter_phone = $row["recruiter_phone"];
        $recruiter->recruiter_email = $row["recruiter_email"];
    }
    $data[] = $recruiter;
    $json = json_encode($data);
    echo "{" . '"recruiter"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

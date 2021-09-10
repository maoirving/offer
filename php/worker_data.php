<?php
include 'conn.php';
$json = '';
$data = array();
$username = $_COOKIE["username"];

class Worker
{
    public $worker_imgUrl;
    public $worker_name;
    public $worker_sex;
    public $worker_birthday;
    public $worker_phone;
    public $worker_email;
    public $worker_address;
}

$sql = "SELECT * FROM worker WHERE username = '$username'";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $worker = new Worker();
        $worker->worker_imgUrl = $row["user_imgUrl"];
        $worker->worker_name = $row["worker_name"];
        $worker->worker_sex = $row["worker_sex"];
        $worker->worker_birthday = $row["worker_birthday"];
        $worker->worker_phone = $row["worker_phone"];
        $worker->worker_email = $row["worker_email"];
        $worker->worker_address = $row["worker_address"];
    }
    $data[] = $worker;
    $json = json_encode($data);
    echo "{" . '"worker"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

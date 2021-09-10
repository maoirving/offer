<?php
include 'conn.php';
$json = '';
$data = array();

class Job
{
    public $name;
    public $pub_time;
    public $salary;
    public $require;
    public $education;
    public $company;
}

$sql = "SELECT * FROM job";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $job = new Job();
        $job->name = $row["job_name"];
        $job->pub_time = $row["pub_time"];
        $job->salary = $row["salary"];
        $job->require = $row["experience"];
        $job->education = $row["education"];
        $job->company = $row["company"];
        $data[] = $job;
    }
    $json = json_encode($data);
    echo "{" . '"job"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

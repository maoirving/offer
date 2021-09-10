<?php
include 'conn.php';
$json = '';
$data = array();

class New_Job
{
    public $job_id;
    public $name;
    public $salary;
}

$sql = "SELECT job_id, job_name, salary FROM job ORDER BY pub_time DESC LIMIT 7";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $job = new New_Job();
        $job->job_id = $row["job_id"];
        $job->name = $row["job_name"];
        $job->salary = $row["salary"];
        $data[] = $job;
    }
    $json = json_encode($data);
    echo "{" . '"job"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

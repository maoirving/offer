<?php
include 'conn.php';
$json = '';
$data = array();
$company_id = $_COOKIE["company_id"];
$keyword = $_GET["keyword"];

class Job
{
    public $job_id;
    public $job_name;
    public $job_type;
    public $wanted_num;
    public $experience;
    public $education;
    public $salary;
    public $pub_time;
}

if ($keyword == "") {
    $sql = "SELECT * FROM job where company_id='$company_id' ORDER BY pub_time DESC";
} else {
    $keyword = '%' . $keyword . '%';
    $sql = "SELECT * FROM job where company_id='$company_id' AND job_name like '$keyword' ORDER BY pub_time DESC";
}
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $job = new Job();
        $job->job_id = $row["job_id"];
        $job->job_name = $row["job_name"];
        $job->job_type = $row["job_type"];
        $job->wanted_num = $row["wanted_num"];
        $job->experience = $row["experience"];
        $job->education = $row["education"];
        $job->salary = $row["salary"];
        $job->pub_time = $row["pub_time"];
        $data[] = $job;
    }
    $json = json_encode($data);
    echo "{" . '"job"' . ":" . $json . "}";
} else {
    echo "0";
}

mysqli_close($conn);

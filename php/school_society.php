<?php
include 'conn.php';
$job_type = $_GET["job_type"];
$json = '';
$data = array();

class School_Job
{
    public $job_id;
    public $name;
    public $area;
    public $salary;
    public $require;
    public $education;
    public $company_name;
}

$sql = "SELECT job_id, job_name, salary, work_place, experience, education, company_id FROM job WHERE job_type = '$job_type' ORDER BY pub_time DESC LIMIT 6";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $job = new School_Job();
        $job->job_id = $row["job_id"];
        $job->name = $row["job_name"];
        $job->area = $row["work_place"];
        $job->salary = $row["salary"];
        $job->require = $row["experience"];
        $job->education = $row["education"];
        $company_id = $row["company_id"];
        $sql1 = "SELECT company_name FROM company WHERE company_id='$company_id'";
        $result1 = mysqli_query($conn, $sql1);
        if (mysqli_num_rows($result1) > 0) {
            while ($row1 = mysqli_fetch_assoc($result1)) {
                $job->company_name = $row1["company_name"];
            }
        }
        $data[] = $job;
    }
    $json = json_encode($data);
    echo "{" . '"job"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

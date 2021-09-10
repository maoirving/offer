<?php
include 'conn.php';
$username = $_COOKIE["username"];
$json = '';
$data = array();

class Applied_Job
{
    public $job_id;
    public $name;
    public $area;
    public $salary;
    public $require;
    public $education;
    public $isRead;
    public $company_name;
}

$sql = "SELECT
	job_id,
	job_name,
	work_place,
	salary,
	experience,
	education,
	isRead,
	company_name 
FROM
	applied
	LEFT OUTER JOIN company ON applied.company_id = company.company_id 
WHERE
	username = '$username' 
ORDER BY
	applied_time DESC 
	LIMIT 4";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $applied_job = new Applied_Job();
        $applied_job->job_id = $row["job_id"];
        $applied_job->name = $row["job_name"];
        $applied_job->area = $row["work_place"];
        $applied_job->salary = $row["salary"];
        $applied_job->require = $row["experience"];
        $applied_job->education = $row["education"];
        $applied_job->isRead = $row["isRead"];
        $applied_job->company_name = $row["company_name"];
        $data[] = $applied_job;
    }
    $json = json_encode($data);
    echo "{" . '"applied_job"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

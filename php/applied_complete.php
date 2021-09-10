<?php
include 'conn.php';
$username = $_COOKIE["username"];
$isHandle = $_GET["isHandle"];
$json = '';
$data = array();

class Applied_Job
{
    public $applied_id;
    public $job_id;
    public $applied_time;
    public $isRead;
    public $read_time;
    public $name;
    public $area;
    public $salary;
    public $require;
    public $education;
    public $company_name;
    public $company_imgUrl;
}


if ($isHandle == "") {
    $sql = "SELECT
	applied_id,
	applied.job_id,
	applied.job_name,
	applied.work_place,
	applied.salary,
	applied.experience,
	applied.education,
	applied_time,
	isRead,
	read_time,
	company_name,
	company_imgUrl 
FROM
	applied
	LEFT OUTER JOIN job ON applied.job_id = job.job_id
	LEFT OUTER JOIN company ON applied.company_id = company.company_id 
WHERE
	username = '$username'
ORDER BY
	applied_time DESC";
} else if ($isHandle == 'read') {
    $sql = "SELECT
	applied_id,
	applied.job_id,
	applied.job_name,
	applied.work_place,
	applied.salary,
	applied.experience,
	applied.education,
	applied_time,
	isRead,
	read_time,
	company_name,
	company_imgUrl 
FROM
	applied
	LEFT OUTER JOIN job ON applied.job_id = job.job_id
	LEFT OUTER JOIN company ON applied.company_id = company.company_id 
WHERE
	username = '$username' and isRead ='1' 
ORDER BY
	applied_time DESC";
} else {
    $sql = "SELECT
	applied_id,
	applied.job_id,
	applied.job_name,
	applied.work_place,
	applied.salary,
	applied.experience,
	applied.education,
	applied_time,
	isRead,
	read_time,
	company_name,
	company_imgUrl 
FROM
	applied
	LEFT OUTER JOIN job ON applied.job_id = job.job_id
	LEFT OUTER JOIN company ON applied.company_id = company.company_id 
WHERE
    username = '$username' and isHandle ='$isHandle' 
ORDER BY
	applied_time DESC";
}

$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $applied_job = new Applied_Job();
        $applied_job->job_id = $row["job_id"];
        $applied_job->applied_id = $row["applied_id"];
        $applied_job->applied_time = $row["applied_time"];
        $applied_job->isRead = $row["isRead"];
        $applied_job->read_time = $row["read_time"];
        $applied_job->name = $row["job_name"];
        $applied_job->area = $row["work_place"];
        $applied_job->salary = $row["salary"];
        $applied_job->require = $row["experience"];
        $applied_job->education = $row["education"];
        $applied_job->company_name = $row["company_name"];
        $applied_job->company_imgUrl = $row["company_imgUrl"];
        $data[] = $applied_job;
    }
    $json = json_encode($data);
    echo "{" . '"applied_job"' . ":" . $json . "}";
} else {
    echo "error";
}
mysqli_close($conn);

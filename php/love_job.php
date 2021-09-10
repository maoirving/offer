<?php
include 'conn.php';
$username = $_COOKIE["username"];
$json = '';
$data = array();

class Love_Job
{
    public $love_id;
    public $job_id;
    public $love_time;
    public $isDeleted;
    public $job_name;
    public $work_place;
    public $salary;
    public $experience;
    public $education;
    public $company_name;
    public $company_imgUrl;
}

$sql = "SELECT
	love_id,
	love.job_id,
	love.job_name,
	love.work_place,
	love.salary,
	love.experience,
	love.education,
	love_time,
	isDeleted,
	company_name,
	company_imgUrl 
FROM
	love
	LEFT OUTER JOIN job ON love.job_id = job.job_id
	LEFT OUTER JOIN company ON love.company_id = company.company_id 
WHERE
	username = '$username' 
ORDER BY
	love_time DESC";

$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $love_job = new Love_Job();
        $love_job->love_id = $row["love_id"];
        $love_job->job_id = $row["job_id"];
        $love_job->love_time = $row["love_time"];
        $love_job->isDeleted = $row["isDeleted"];
        $love_job->job_name = $row["job_name"];
        $love_job->work_place = $row["work_place"];
        $love_job->salary = $row["salary"];
        $love_job->experience = $row["experience"];
        $love_job->education = $row["education"];
        $love_job->company_name = $row["company_name"];
        $love_job->company_imgUrl = $row["company_imgUrl"];
        $data[] = $love_job;
    }
    $json = json_encode($data);
    echo "{" . '"love_job"' . ":" . $json . "}";
} else {
    echo "error";
}
mysqli_close($conn);

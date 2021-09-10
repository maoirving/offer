<?php
include 'conn.php';
$company_id = $_COOKIE["company_id"];
$keyword = $_GET["keyword"];
$json = '';
$data = array();

class Applied_Worker
{
    public $applied_id;
    public $username;
    public $worker_name;
    public $job_id;
    public $job_name;
    public $resume_id;
    public $education;
    public $resume_type;
    public $resume_fileUrl;
    public $applied_time;
    public $isRead;
    public $read_time;
    public $isHandle;
}

if ($keyword == "") {
    $sql = "SELECT
	applied_id,
	applied.username,
	worker_name,
	applied.job_id,
	applied.job_name,
	resume.resume_id,
	resume.education,
	resume_fileUrl,
	resume_type,
	applied_time,
	isRead,
	read_time,
	isHandle 
FROM
	applied
	LEFT OUTER JOIN worker ON applied.username = worker.username
	LEFT OUTER JOIN job ON applied.job_id = job.job_id
	LEFT OUTER JOIN resume ON applied.username = resume.username 
WHERE
	applied.company_id = '$company_id' 
ORDER BY
	applied_time DESC";
} else {
    $keyword = '%' . $keyword . '%';
    $sql = "SELECT
	applied_id,
	applied.username,
	worker_name,
	applied.job_id,
	applied.job_name,
	resume.resume_id,
	resume.education,
	resume_fileUrl,
	resume_type,
	applied_time,
	isRead,
	read_time,
	isHandle 
FROM
	applied
	LEFT OUTER JOIN worker ON applied.username = worker.username
	LEFT OUTER JOIN job ON applied.job_id = job.job_id
	LEFT OUTER JOIN resume ON applied.username = resume.username 
WHERE
	applied.company_id = '$company_id' and applied.job_name like '$keyword'
ORDER BY
	applied_time DESC";
}

$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $applied = new Applied_Worker();
        $applied->applied_id = $row["applied_id"];
        $applied->username = $row["username"];
        $applied->worker_name = $row["worker_name"];
        $applied->job_id = $row["job_id"];
        $applied->job_name = $row["job_name"];
        $applied->resume_id = $row["resume_id"];
        $applied->education = $row["education"];
        $applied->resume_type = $row["resume_type"];
        $applied->resume_fileUrl = $row["resume_fileUrl"];
        $applied->applied_time = $row["applied_time"];
        $applied->isRead = $row["isRead"];
        $applied->read_time = $row["read_time"];
        $applied->isHandle = $row["isHandle"];
        $data[] = $applied;
    }
    $json = json_encode($data);
    echo "{" . '"applied"' . ":" . $json . "}";
} else {
    echo "0";
}

mysqli_close($conn);


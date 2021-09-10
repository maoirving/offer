<?php
include 'conn.php';
$json = '';
$data = array();
$username = "";
if ($_GET["username"] != "") {
    $username = $_GET["username"];
} else {
    $username = $_COOKIE["username"];
}

class Resume
{
    public $resume_id;
    public $user_imgUrl;
    public $worker_name;
    public $worker_sex;
    public $worker_birthday;
    public $worker_phone;
    public $worker_email;
    public $worker_address;
    public $desirable_job;
    public $desirable_city;
    public $desirable_salary;
    public $project_name;
    public $project_period;
    public $project_description;
    public $work_type;
    public $work_period;
    public $work_company;
    public $work_content;
    public $school;
    public $school_imgUrl;
    public $isPassed;
    public $school_period;
    public $specialized_subject;
    public $education;
    public $school_experience;
    public $certificate;
    public $resume_fileUrl;
}

$sql = "SELECT
	*
FROM
	worker
	LEFT OUTER JOIN resume ON worker.username = resume.username 
WHERE
	worker.username = '$username'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $resume = new Resume();
        $resume->resume_id = $row["resume_id"];
        $resume->user_imgUrl = $row["user_imgUrl"];
        $resume->worker_name = $row["worker_name"];
        $resume->worker_sex = $row["worker_sex"];
        $resume->worker_birthday = $row["worker_birthday"];
        $resume->worker_phone = $row["worker_phone"];
        $resume->worker_email = $row["worker_email"];
        $resume->worker_address = $row["worker_address"];
        $resume->desirable_job = $row["desirable_job"];
        $resume->desirable_city = $row["desirable_city"];
        $resume->desirable_salary = $row["desirable_salary"];
        $resume->project_name = $row["project_name"];
        $resume->project_period = $row["project_period"];
        $resume->project_description = $row["project_description"];
        $resume->work_type = $row["work_type"];
        $resume->work_period = $row["work_period"];
        $resume->work_company = $row["work_company"];
        $resume->work_content = $row["work_content"];
        $resume->school = $row["school"];
        $resume->school_imgUrl = $row["school_imgUrl"];
        $resume->isPassed = $row["isPassed"];
        $resume->school_period = $row["school_period"];
        $resume->specialized_subject = $row["specialized_subject"];
        $resume->education = $row["education"];
        $resume->school_experience = $row["school_experience"];
        $resume->certificate = $row["certificate"];
        $resume->resume_fileUrl = $row["resume_fileUrl"];
        $data[] = $resume;
    }
    $json = json_encode($data);
    echo "{" . '"resume"' . ":" . $json . "}";
} else {
    echo "error";
}

mysqli_close($conn);

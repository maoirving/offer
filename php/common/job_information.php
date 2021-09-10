<?php
include 'conn.php';
$json = '';
$data = array();
$job_id = $_GET["job_id"];

class Job
{
    public $name;
    public $type;
    public $area;
    public $pub_time;
    public $wanted_num;
    public $salary;
    public $require;
    public $education;
    public $job_description;
    public $job_skill;
    public $company_id;
    public $company_imgUrl;
    public $company_name;
    public $company_type;
    public $company_finance;
    public $address;
    public $company_headcount;
    public $introduction;
    public $representative;
    public $registered_capital;
    public $registered_date;
    public $recruiter_name;
    public $recruiter_phone;
    public $recruiter_email;
}

$sql = "SELECT
	* 
FROM
	job
	LEFT OUTER JOIN company ON job.company_id = company.company_id 
	LEFT OUTER JOIN recruiter ON job.company_id = recruiter.company_id 
WHERE
	job_id = '$job_id' 
ORDER BY
	pub_time DESC";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $job = new Job();
        $job->name = $row["job_name"];
        $job->type = $row["job_type"];
        $job->area = $row["work_place"];
        $job->pub_time = $row["pub_time"];
        $job->wanted_num = $row["wanted_num"];
        $job->salary = $row["salary"];
        $job->require = $row["experience"];
        $job->education = $row["education"];
        $job->job_description = $row["job_description"];
        $job->job_skill = $row["job_skill"];
        $job->company_id = $row["company_id"];
        $job->company_imgUrl = $row["company_imgUrl"];
        $job->company_name = $row["company_name"];
        $job->company_type = $row["company_type"];
        $job->company_finance = $row["finance"];
        $job->address = $row["address"];
        $job->company_headcount = $row["headcount"];
        $job->introduction = $row["introduction"];
        $job->representative = $row["representative"];
        $job->registered_capital = $row["registered_capital"];
        $job->registered_date = $row["registered_date"];
        $job->recruiter_name = $row["recruiter_name"];
        $job->recruiter_phone = $row["recruiter_phone"];
        $job->recruiter_email = $row["recruiter_email"];
        $data[] = $job;
    }
    $json = json_encode($data);
    echo "{" . '"job"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

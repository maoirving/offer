<?php
include 'conn.php';
$username = $_COOKIE["username"];
$first_isAgreed = $_GET["isAgreed"];
$json = '';
$data = array();

class Message
{
    public $message_id;
    public $recruiter_id;
    public $username;
    public $interview_id;
    public $applied_id;
    public $recruiter_imgUrl;
    public $recruiter_name;
    public $recruiter_type;
    public $job_name;
    public $company_name;
    public $interview_content;
    public $message_time;
    public $isAgreed;
}

if ($first_isAgreed != "") {
    $sql = "SELECT
	user_imgUrl,
	worker_message.recruiter_id,
	recruiter_name,
	recruiter_type,
	worker_message.job_name,
	company_name,
	message_id,
	worker_message.interview_id,
	worker_message.applied_id,
	interview_content,
	message_time,
	worker_message.isAgreed 
FROM
	worker_message
	LEFT OUTER JOIN interview ON worker_message.interview_id = interview.interview_id
	LEFT OUTER JOIN recruiter ON worker_message.recruiter_id = recruiter.recruiter_id
	LEFT OUTER JOIN job ON worker_message.job_id = job.job_id
	LEFT OUTER JOIN company ON worker_message.company_id = company.company_id 
WHERE
	worker_message.username = '$username' 
	AND worker_message.isAgreed = '$first_isAgreed' 
ORDER BY
	message_time DESC";
} else {
    $sql = "SELECT
	user_imgUrl,
	worker_message.recruiter_id,
	recruiter_name,
	recruiter_type,
	worker_message.job_name,
	company_name,
	message_id,
	worker_message.interview_id,
	worker_message.applied_id,
	interview_content,
	message_time,
	worker_message.isAgreed 
FROM
	worker_message
	LEFT OUTER JOIN interview ON worker_message.interview_id = interview.interview_id
	LEFT OUTER JOIN recruiter ON worker_message.recruiter_id = recruiter.recruiter_id
	LEFT OUTER JOIN job ON worker_message.job_id = job.job_id
	LEFT OUTER JOIN company ON worker_message.company_id = company.company_id 
WHERE
	worker_message.username = '$username' 
ORDER BY
	message_time DESC";
}

$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $message = new Message();
        $message->message_id = $row["message_id"];
        $message->username = $username;
        $message->recruiter_id = $row["recruiter_id"];
        $message->interview_id = $row["interview_id"];
        $message->applied_id = $row["applied_id"];
        $message->recruiter_imgUrl = $row["user_imgUrl"];
        $message->recruiter_name = $row["recruiter_name"];
        $message->recruiter_type = $row["recruiter_type"];
        $message->job_name = $row["job_name"];
        $message->company_name = $row["company_name"];
        $message->interview_content = $row["interview_content"];
        $message->message_time = $row["message_time"];
        $message->isAgreed = $row["isAgreed"];
        $data[] = $message;
    }
    $json = json_encode($data);
    echo "{" . '"message"' . ":" . $json . "}";
} else {
    echo "error";
}
mysqli_close($conn);

<?php
include 'conn.php';
$recruiter_id = $_COOKIE["recruiter_id"];
$isAgreed = $_GET["isAgreed"];
$json = '';
$data = array();

class Message
{
    public $message_id;
    public $worker_name;
    public $user_imgUrl;
    public $job_name;
    public $school;
    public $education;
    public $interview_id;
    public $applied_id;
    public $isAgreed;
    public $message_time;
}

$sql = "SELECT
	message_id,
	worker_name,
	user_imgUrl,
	job_name,
	school,
	education,
	recruiter_message.interview_id,
	recruiter_message.applied_id,
	recruiter_message.isAgreed,
	message_time 
FROM
	recruiter_message
	LEFT OUTER JOIN worker ON recruiter_message.username = worker.username
	LEFT OUTER JOIN interview ON recruiter_message.interview_id = interview.interview_id
	LEFT OUTER JOIN resume ON recruiter_message.username = resume.username 
WHERE
	recruiter_message.recruiter_id = '$recruiter_id' 
	AND interview.isAgreed = '$isAgreed' 
ORDER BY
	message_time DESC";

$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $message = new Message();
        $message->message_id = $row["message_id"];
        $message->worker_name = $row["worker_name"];
        $message->user_imgUrl = $row["user_imgUrl"];
        $message->job_name = $row["job_name"];
        $message->school = $row["school"];
        $message->education = $row["education"];
        $message->interview_id = $row["interview_id"];
        $message->applied_id = $row["applied_id"];
        $message->isAgreed = $row["isAgreed"];
        $message->message_time = $row["message_time"];
        $data[] = $message;
    }
    $json = json_encode($data);
    echo "{" . '"message"' . ":" . $json . "}";
} else {
    echo "error";
}
mysqli_close($conn);

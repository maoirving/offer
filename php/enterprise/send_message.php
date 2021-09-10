<?php
if ($_POST) {
    include 'conn.php';
    $applied_id = $_POST["applied_id"];
    $username = $_POST["username"];
    $recruiter_id = $_COOKIE["recruiter_id"];
    $interview_id = "";
    $job_id = $_POST["job_id"];
    $job_name = $_POST["job_name"];
    $company_id = $_COOKIE["company_id"];
    $message_time = $_POST["message_time"];
    $interview_date = $_POST["interview_date"];
    $interview_time = $_POST["interview_time"];
    $interview_address = $_POST["interview_address"];
    $interview_content = $_POST["interview_content"];
    $sql0 = "SELECT * FROM worker_message WHERE applied_id = '$applied_id' AND username = '$username'";
    if (mysqli_query($conn, $sql0)) {
        if (!mysqli_affected_rows($conn)) {
            $sql = "INSERT INTO interview ( interview_date, interview_time, interview_address, interview_content, applied_id )
VALUES
	(
		'$interview_date',
		'$interview_time',
	'$interview_address',
	'$interview_content',
	'$applied_id')";
            if (mysqli_query($conn, $sql)) {
                $sql2 = "SELECT
	interview_id 
FROM
	interview 
ORDER BY
	interview_id DESC 
	LIMIT 1";
                $result = mysqli_query($conn, $sql2);
                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        $interview_id = $row["interview_id"];
                    }
                    $sql3 = "INSERT INTO worker_message ( username, recruiter_id, applied_id, job_id, job_name, interview_id, company_id, message_time )
VALUES
	(
		'$username',
		'$recruiter_id',
		'$applied_id',
		'$job_id',
		'$job_name',
		'$interview_id',
		'$company_id',
	'$message_time' 
	)";
                    if (mysqli_query($conn, $sql3)) {
                        echo "ok";
                    }
                } else {
                    echo "error2";
                }
            } else {
                echo "error3";
            }
        } else {
            $sql1 = "UPDATE interview
            SET interview_date = '$interview_date',
            interview_time = '$interview_time',
            interview_address = '$interview_address',
            interview_content = '$interview_content'
            WHERE
            	applied_id = '$applied_id'";
            if (mysqli_query($conn, $sql1)) {
                if (mysqli_affected_rows($conn)) {
                    echo "change_ok";
                } else {
                    echo "exist";
                }
            } else {
                echo "error3";
            }
        }
    } else {
        echo "error1";
    }
    mysqli_close($conn);
}

<?php
if ($_POST) {
    include 'conn.php';
    $message_id = $_POST["message_id"];
    $recruiter_id = $_POST["recruiter_id"];
    $username = $_POST["username"];
    $job_name = $_POST["job_name"];
    $interview_id = $_POST["interview_id"];
    $applied_id = $_POST["applied_id"];
    $message_time = $_POST["message_time"];
    $isAgreed = $_POST["isAgreed"];
    $sql = "UPDATE worker_message SET isAgreed = '$isAgreed' WHERE message_id = '$message_id'";
    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn)) {
            $sql0 = "SELECT * FROM recruiter_message WHERE applied_id = '$applied_id' AND username = '$username'";
            if (mysqli_query($conn, $sql0)) {
                if (!mysqli_affected_rows($conn)) {
                    $sql1 = "INSERT INTO recruiter_message ( recruiter_id, username, job_name, interview_id, applied_id, isAgreed, message_time )
VALUES
	(
		'$recruiter_id',
		'$username',
		'$job_name',
		'$interview_id',
		'$applied_id',
		'$isAgreed',
	'$message_time' 
	)";
                    if (mysqli_query($conn, $sql1)) {
                        echo "ok";
                    } else {
                        echo "error1";
                    }
                } else {
                    echo "ok";
                }
            } else {
                echo "error2";
            }
        } else {
            echo "exist";
        }
    } else {
        echo "error";
//        echo

    }
    mysqli_close($conn);
}

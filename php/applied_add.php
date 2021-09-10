<?php
if ($_POST) {
    include 'conn.php';
    $username = $_COOKIE["username"];
    $job_id = $_POST['job_id'];
    $job_name = $_POST['job_name'];
    $experience = $_POST['experience'];
    $salary = $_POST['salary'];
    $work_place = $_POST['work_place'];
    $education = $_POST['education'];
    $company_id = $_POST['company_id'];
    $resume_type = $_POST['resume_type'];
    $applied_time = $_POST['applied_time'];
    if ($username != "") {
        $sql = "select * from applied where username='$username' and job_id='$job_id'";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result)) {
            echo "exist";
        } else {
            $sql1 = "insert into applied (username, job_id, job_name, experience, salary, work_place, education, company_id, resume_type, applied_time)
 values ('$username', '$job_id', '$job_name', '$experience', '$salary', '$work_place', '$education', '$company_id', '$resume_type', '$applied_time')";
            if (mysqli_query($conn, $sql1)) {
                echo "ok";
            } else {
                echo "error";
            }
        }
        mysqli_close($conn);
    } else {
        echo "no_signed";
    }

}

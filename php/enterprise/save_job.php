<?php
if ($_POST) {
    include 'conn.php';
    $job_name = $_POST["job_name"];
    $job_type = $_POST["job_type"];
    $wanted_num = $_POST["wanted_num"];
    $salary = $_POST["salary"];
    $work_place = $_POST["work_place"];
    $experience = $_POST["experience"];
    $education = $_POST["education"];
    $job_description = $_POST["job_description"];
    $job_skill = $_POST["job_skill"];
    $company_id = $_POST["company_id"];
    $pub_time = $_POST["pub_time"];
    $sql = "insert into job(job_name, job_type, wanted_num, salary, work_place, experience, education, job_description, job_skill, company_id, pub_time) 
    values('$job_name', '$job_type', '$wanted_num', '$salary', '$work_place', '$experience', '$education', '$job_description', '$job_skill', '$company_id', '$pub_time')";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        echo "ok";
    } else {
        echo "error";
    }
    mysqli_close($conn);
}

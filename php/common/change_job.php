<?php
if ($_POST) {
    include 'conn.php';
    $job_id = $_POST["job_id"];
    $job_name = $_POST["job_name"];
    $job_type = $_POST["job_type"];
    $wanted_num = $_POST["wanted_num"];
    $job_description = $_POST["job_description"];
    $work_place = $_POST["work_place"];
    $salary = $_POST["salary"];
    $job_skill = $_POST["job_skill"];
    $experience = $_POST["experience"];
    $education = $_POST["education"];
    $sql = "UPDATE job 
                SET job_name = '$job_name',
                job_type = '$job_type',
                wanted_num = '$wanted_num',
                job_description = '$job_description',
                work_place = '$work_place',
                salary = '$salary',
                job_skill = '$job_skill', 
                experience = '$experience', 
                education = '$education'
                WHERE
                	job_id = '$job_id'";
    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn)) {
            echo "ok";
        } else {
            echo "exist";
        }
    } else {
        echo "error";
    }
    mysqli_close($conn);
}

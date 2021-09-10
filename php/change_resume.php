<?php
if ($_POST) {
    include 'conn.php';
    $username = $_COOKIE["username"];
    $desirable_job = $_POST["desirable_job"];
    $desirable_city = $_POST["desirable_city"];
    $desirable_salary = $_POST["desirable_salary"];
    $school = $_POST["school"];
    $school_period = $_POST["school_period"];
    $specialized_subject = $_POST["specialized_subject"];
    $education = $_POST["education"];
    $school_experience = $_POST["school_experience"];
    $project_name = $_POST["project_name"];
    $project_period = $_POST["project_period"];
    $project_description = $_POST["project_description"];
    $work_type = $_POST["work_type"];
    $work_period = $_POST["work_period"];
    $work_company = $_POST["work_company"];
    $work_content = $_POST["work_content"];
    $certificate = $_POST["certificate"];
    $sql = "UPDATE resume 
                SET desirable_job = '$desirable_job',
                desirable_city = '$desirable_city',
                desirable_salary = '$desirable_salary',
                school = '$school',
                school_period = '$school_period',
                specialized_subject = '$specialized_subject', 
                education = '$education', 
                school_experience = '$school_experience', 
                project_name = '$project_name',
                project_period = '$project_period',
                project_description = '$project_description',
                work_type = '$work_type',
                work_period = '$work_period',
                work_company = '$work_company',
                work_content = '$work_content',
                certificate = '$certificate'
                WHERE
                	username = '$username'";
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

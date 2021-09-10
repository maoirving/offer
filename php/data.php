<?php
include 'conn.php';
$json = '';
$data = array();

class Job
{
    public $job_id;
    public $name;
    public $job_type;
    public $area;
    public $pub_time;
    public $salary;
    public $require;
    public $education;
    public $company_name;
    public $company_type;
    public $company_finance;
    public $company_headcount;
}

$job_type = $_GET["job_type"];
$search_content = $_GET["search_content"];
if ($job_type != "") {
    $sql = "SELECT * FROM job WHERE job_type = '$job_type' ORDER BY pub_time DESC";
    if ($search_content != "") {
        $search_content = '%' . $search_content . '%';
        $sql = "SELECT * FROM job WHERE job_type = '$job_type' AND job_name like '$search_content' ORDER BY pub_time DESC";
    }
} else {
    $sql = "SELECT * FROM job ORDER BY pub_time DESC";
    if ($search_content != "") {
        $search_content = '%' . $search_content . '%';
        $sql = "SELECT * FROM job WHERE job_name like '$search_content' ORDER BY pub_time DESC";
    }
}
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $job = new Job();
        $job->job_id = $row["job_id"];
        $job->name = $row["job_name"];
        $job->job_type = $row["job_type"];
        $job->area = $row["work_place"];
        $job->pub_time = $row["pub_time"];
        $job->salary = $row["salary"];
        $job->require = $row["experience"];
        $job->education = $row["education"];
        $company_id = $row["company_id"];
        $sql1 = "SELECT company_name, company_type, finance, headcount FROM company WHERE company_id='$company_id'";
        $result1 = mysqli_query($conn, $sql1);
        if (mysqli_num_rows($result1) > 0) {
            while ($row1 = mysqli_fetch_assoc($result1)) {
                $job->company_name = $row1["company_name"];
                $job->company_type = $row1["company_type"];
                $job->company_finance = $row1["finance"];
                $job->company_headcount = $row1["headcount"];
            }
        }
        $data[] = $job;
    }
    $json = json_encode($data);
    echo "{" . '"job"' . ":" . $json . "}";
} else {
    echo "0";
}

mysqli_close($conn);

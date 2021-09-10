<?php
include 'conn.php';
$json = '';
$data = array();
$keyword = $_GET["keyword"];

class Company
{
    public $company_id;
    public $company_imgUrl;
    public $company_name;
    public $company_type;
    public $finance;
    public $address;
    public $introduction;
    public $headcount;
    public $representative;
    public $registered_capital;
    public $registered_date;
    public $change_time;
    public $isPassed;
}

if ($keyword == "") {
    $sql = "SELECT * FROM company ORDER BY company_id DESC";
} else {
    $keyword = '%' . $keyword . '%';
    $sql = "SELECT * FROM company where company_name like '$keyword' ORDER BY company_id DESC";
}
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $company = new Company();
        $company->company_id = $row["company_id"];
        $company->company_imgUrl = $row["company_imgUrl"];
        $company->company_name = $row["company_name"];
        $company->company_type = $row["company_type"];
        $company->finance = $row["finance"];
        $company->address = $row["address"];
        $company->introduction = $row["introduction"];
        $company->headcount = $row["headcount"];
        $company->representative = $row["representative"];
        $company->registered_capital = $row["registered_capital"];
        $company->registered_date = $row["registered_date"];
        $company->change_time = $row["change_time"];
        $company->isPassed = $row["isPassed"];
        $data[] = $company;
    }
    $json = json_encode($data);
    echo "{" . '"company"' . ":" . $json . "}";
} else {
    echo "0";
}

mysqli_close($conn);

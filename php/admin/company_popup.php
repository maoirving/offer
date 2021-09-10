<?php
include 'conn.php';
$json = '';
$data = array();
$company_id = $_GET["company_id"];

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
    public $business_imgUrl;
}

$sql = "SELECT
	company_id,
	company_imgUrl,
	company_name,
	company_type,
	finance,
	address,
	introduction,
	headcount,
	representative,
	registered_capital,
	registered_date,
	business_imgUrl
FROM
	company
WHERE
	company_id = '$company_id'";
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
        $company->business_imgUrl = $row["business_imgUrl"];
        $data[] = $company;
    }
    $json = json_encode($data);
    echo "{" . '"company"' . ":" . $json . "}";
} else {
    echo "error";
}

mysqli_close($conn);

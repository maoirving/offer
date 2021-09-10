<?php
include 'conn.php';
$applied_id = $_GET["applied_id"];
$json = '';
$data = array();

class Interview
{
    public $interview_date;
    public $interview_time;
    public $interview_address;
    public $interview_content;
}

$sql = "SELECT
	interview_date,
	interview_time,
	interview_address,
	interview_content
FROM
	interview
WHERE
	applied_id = '$applied_id'";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $interview = new Interview();
        $interview->interview_date = $row["interview_date"];
        $interview->interview_time = $row["interview_time"];
        $interview->interview_address = $row["interview_address"];
        $interview->interview_content = $row["interview_content"];
        $data[] = $interview;
    }
    $json = json_encode($data);
    echo "{" . '"interview"' . ":" . $json . "}";
} else {
    echo "error";
}
mysqli_close($conn);

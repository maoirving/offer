<?php
include 'conn.php';
$company_id = $_GET["company_id"];
$sql = "DELETE FROM company WHERE company_id = '$company_id'";
if ($_GET["num"] == 'many') {
    $sql = "DELETE FROM company WHERE company_id in$company_id";
}
if (mysqli_query($conn, $sql)) {
    if (mysqli_affected_rows($conn)) {
        echo "ok";
    } else {
        echo "error";
    }
} else {
    echo "error";
}
mysqli_close($conn);
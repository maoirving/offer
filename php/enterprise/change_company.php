<?php
if ($_POST) {
    include 'conn.php';
    $username = $_COOKIE["recruiter_username"];
    $company_name = $_POST["company_name"];
    $company_type = $_POST["company_type"];
    $finance = $_POST["finance"];
    $headcount = $_POST["headcount"];
    $company_address = $_POST["company_address"];
    $introduction = $_POST["introduction"];
    $representative = $_POST["representative"];
    $registered_capital = $_POST["registered_capital"];
    $registered_date = $_POST["registered_date"];
    if (empty($_COOKIE["company_id"])) {
        $sql = "INSERT INTO company ( company_name, company_type, finance, headcount, address, introduction, representative, registered_capital, registered_date )
                VALUES
                	(
                		'$company_name',
                		'$company_type',
                		'$finance',
                		'$headcount',
                		'$company_address',
                		'$introduction',
                		'$representative',
                	'$registered_capital',
                	'$registered_date')";
        if (mysqli_query($conn, $sql)) {
            $sql2 = "SELECT
	company_id 
FROM
	company 
ORDER BY
	company_id DESC 
	LIMIT 1";
            $result = mysqli_query($conn, $sql2);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $company_id = $row["company_id"];
                }
            }
            $sql3 = "UPDATE recruiter 
SET company_id = '$company_id' 
WHERE
	username = '$username'";
            if (mysqli_query($conn, $sql3)) {
                echo "ok";
            } else {
                echo "error";
            }
        } else {
            echo "error";
        }
    } else {
        $company_id = $_COOKIE["company_id"];
        $sql1 = "UPDATE company 
                SET company_name = '$company_name',
                company_type = '$company_type',
                finance = '$finance',
                headcount = '$headcount',
                address = '$company_address',
                introduction = '$introduction', 
                representative = '$representative', 
                registered_capital = '$registered_capital', 
                registered_date = '$registered_date'
                WHERE
                	company_id = '$company_id'";
        if (mysqli_query($conn, $sql1)) {
            if (mysqli_affected_rows($conn)) {
                echo "ok";
            } else {
                echo "exist";
            }
        } else {
            echo "error";
        }
    }
    mysqli_close($conn);
}

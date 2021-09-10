<?php
include 'conn.php';
$recruiter_username = $_COOKIE["recruiter_username"];
$company_imgUrl = "";
$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp); // 获取文件后缀名
if ((($_FILES["file"]["type"] == "image/gif")
        || ($_FILES["file"]["type"] == "image/jpeg")
        || ($_FILES["file"]["type"] == "image/jpg")
        || ($_FILES["file"]["type"] == "image/pjpeg")
        || ($_FILES["file"]["type"] == "image/x-png") * 1
        || ($_FILES["file"]["type"] == "image/png"))
    && ($_FILES["file"]["size"] < 2048000) // 小于 2M
    && in_array($extension, $allowedExts)) {
    if ($_FILES["file"]["error"] > 0) {
        echo "错误：: " . $_FILES["file"]["error"] . "";
    } else {
        $uploadDir = '../../upload/company_images/';
        $dir = dirname(__FILE__) . '/' . $uploadDir;
        file_exists($dir) || (mkdir($dir, 0777, true) && chmod($dir, 0777));
        if (!is_array($_FILES["file"]["name"])) //single file
        {
            $fileName = time() . uniqid() . '.' . pathinfo($_FILES["file"]["name"])['extension'];
            move_uploaded_file($_FILES["file"]["tmp_name"], $dir . $fileName);
            $company_imgUrl = 'upload/company_images/' . $fileName;
        }
//// 判断当前目录下的 user_images 目录是否存在该文件
////// 如果没有 user_images 目录，你需要创建它，user_images 目录权限为 777
////        if (file_exists("../user_images/" . $_FILES["file"]["name"])) {
////            echo $_FILES["file"]["name"] . " 文件已经存在。 ";
////        } else {
////// 如果 user_images 目录不存在该文件则将文件上传到 user_images 目录下
////            move_uploaded_file($_FILES["file"]["tmp_name"], "../user_images/" . $_FILES["file"]["name"]);
//////            echo "user_images/" . $_FILES["file"]["name"];
////            $worker_imgUrl = "user_images/" . $_FILES["file"]["name"];
////        }
    }
} else {
    echo "非法的文件格式";
}
if (empty($_COOKIE["company_id"])) {
    $sql = "INSERT INTO company(company_imgUrl)
        VALUES ('$company_imgUrl')";
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
	username = '$recruiter_username'";
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
    $sql1 = "UPDATE company SET company_imgUrl = '$company_imgUrl' WHERE company_id = '$company_id'";
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


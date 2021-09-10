<?php
include 'conn.php';
$username = $_COOKIE["username"];
$user_imgUrl = "";
$resume_isPassed = "";
$sql = "SELECT
	user_imgUrl,
	resume_id,
	isPassed 
FROM
	worker
	LEFT OUTER JOIN resume ON worker.username = resume.username 
 WHERE 
    resume.username = '$username'";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $user_imgUrl = $row["user_imgUrl"];
        $resume_isPassed = $row["isPassed"];
    }
    $expire = time() + 60 * 60 * 24 * 1;
    setcookie("resume_isPassed", $resume_isPassed, $expire, "/");
    if ($user_imgUrl != "") {
        echo $user_imgUrl;
    } else {
        echo "null";
    }
} else {
    echo "null";
}

mysqli_close($conn);

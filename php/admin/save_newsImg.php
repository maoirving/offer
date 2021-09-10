<?php
include 'conn.php';
$news_imgUrl = "";
$allowedExts = array("gif", "jpeg", "jpg", "JPG", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp); // 获取文件后缀名
if ((($_FILES["file"]["type"] == "image/gif")
        || ($_FILES["file"]["type"] == "image/jpeg")
        || ($_FILES["file"]["type"] == "image/jpg")
        || ($_FILES["file"]["type"] == "image/JPG")
        || ($_FILES["file"]["type"] == "image/pjpeg")
        || ($_FILES["file"]["type"] == "image/x-png") * 1
        || ($_FILES["file"]["type"] == "image/png"))
    && ($_FILES["file"]["size"] < 2048000) // 小于 2M
    && in_array($extension, $allowedExts)) {
    if ($_FILES["file"]["error"] > 0) {
        echo "错误：: " . $_FILES["file"]["error"] . "";
    } else {
        $uploadDir = '../../upload/news_images/';
        $dir = dirname(__FILE__) . '/' . $uploadDir;
        file_exists($dir) || (mkdir($dir, 0777, true) && chmod($dir, 0777));
        if (!is_array($_FILES["file"]["name"])) //single file
        {
            $fileName = time() . uniqid() . '.' . pathinfo($_FILES["file"]["name"])['extension'];
            move_uploaded_file($_FILES["file"]["tmp_name"], $dir . $fileName);
            $news_imgUrl = 'upload/news_images/' . $fileName;
            echo $news_imgUrl;
        }
    }
} else {
    echo "非法的文件格式";
}

mysqli_close($conn);


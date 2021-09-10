<?php
if ($_POST) {
    include 'conn.php';
    $admin_username = $_COOKIE["admin_username"];
    $news_title = $_POST["news_title"];
    $news_type = $_POST["news_type"];
    $news_author = $_POST["news_author"];
    $news_image = $_POST["news_image"];
    $news_brief = $_POST["news_brief"];
    $news_content = $_POST["news_content"];
    $news_pubtime = $_POST["news_pubtime"];
    $sql = "insert into news(news_title, admin_username, news_type, news_author, news_image, news_brief, news_content, news_pubtime) 
    values('$news_title', '$admin_username', '$news_type', '$news_author','$news_image','$news_brief', '$news_content', '$news_pubtime')";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        echo "ok";
    } else {
        echo "error";
    }
    mysqli_close($conn);
}
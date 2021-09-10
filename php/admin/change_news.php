<?php
if ($_POST) {
    include 'conn.php';
    $news_id = $_POST["news_id"];
    $news_title = $_POST["news_title"];
    $news_type = $_POST["news_type"];
    $news_author = $_POST["news_author"];
    $news_brief = $_POST["news_brief"];
    $news_content = $_POST["news_content"];
    $sql = "UPDATE news 
                SET news_title = '$news_title',
                news_type = '$news_type',
                news_author = '$news_author',
                news_brief = '$news_brief',
                news_content = '$news_content'
                WHERE
                	news_id = '$news_id'";
    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn)) {
            echo "ok";
        } else {
            echo "exist";
        }
    } else {
        echo "error";
        echo mysqli_error($conn);
    }
    mysqli_close($conn);
}

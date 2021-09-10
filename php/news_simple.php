<?php
include 'conn.php';
$json = '';
$data = array();

class News
{
    public $news_id;
    public $news_title;
    public $news_type;
    public $news_author;
    public $news_image;
    public $news_brief;
    public $news_pubtime;
}

$sql = "SELECT news_id, news_title, news_type, news_author, news_image, news_brief, news_pubtime FROM news ORDER BY news_pubtime DESC";

if ($_GET) {
    $limit = $_GET["limit"];
    $sql = $sql . " LIMIT " . $limit;
}
//else {
//    $sql = "SELECT news_id, news_title, news_type, news_author, news_image, news_brief, news_pubtime FROM news ORDER BY news_pubtime DESC ";
//}
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $news = new News();
        $news->news_id = $row["news_id"];
        $news->news_title = $row["news_title"];
        $news->news_type = $row["news_type"];
        $news->news_author = $row["news_author"];
        $news->news_image = $row["news_image"];
        $news->news_brief = $row["news_brief"];
        $news->news_pubtime = $row["news_pubtime"];
        $data[] = $news;
    }
    $json = json_encode($data);
    echo "{" . '"news"' . ":" . $json . "}";
} else {
    echo "查询失败";
}

mysqli_close($conn);

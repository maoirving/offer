<?php
include 'conn.php';
$json = '';
$data = array();
$keyword = $_GET["keyword"];

class News
{
    public $news_id;
    public $admin_name;
    public $news_title;
    public $news_type;
    public $news_author;
    public $news_image;
    public $news_brief;
    public $news_content;
    public $news_pubtime;
}

if ($keyword == "") {
    $sql = "SELECT
	* 
FROM
	news
	LEFT OUTER JOIN admin ON news.admin_username = admin.username 
ORDER BY
	news_pubtime DESC";
} else {
    $keyword = '%' . $keyword . '%';
    $sql = "SELECT
	* 
FROM
	news 
	LEFT OUTER JOIN admin ON news.admin_username = admin.username 
WHERE
	news_title LIKE '$keyword' 
ORDER BY
	news_pubtime DESC";
}
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $news = new News();
        $news->news_id = $row["news_id"];
        $news->admin_name = $row["admin_name"];
        $news->news_title = $row["news_title"];
        $news->news_type = $row["news_type"];
        $news->news_author = $row["news_author"];
        $news->news_image = $row["news_image"];
        $news->news_brief = $row["news_brief"];
        $news->news_content = $row["news_content"];
        $news->news_pubtime = $row["news_pubtime"];
        $data[] = $news;
    }
    $json = json_encode($data);
    echo "{" . '"news"' . ":" . $json . "}";
} else {
    echo "0";
}

mysqli_close($conn);

<?php
include 'conn.php';
$news_id = $_GET["news_id"];
$sql = "DELETE FROM news WHERE news_id = '$news_id'";
if ($_GET["num"] == 'many') {
    $sql = "DELETE FROM news WHERE news_id in$news_id";
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
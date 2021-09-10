<?php
include 'conn.php';
$json = '';
$data = array();
$keyword = $_GET["keyword"];

class Users
{
    public $user_id;
    public $username;
    public $user_type;
    public $user_imgUrl;
    public $true_name;
    public $sex;
    public $phone;
    public $register_time;
}

if ($keyword == "") {
    $sql = "SELECT
	user_id,
	users.username,
	IF
	( user_type = 'worker', '个人用户', '企业用户' ) AS user_type,
IF
	(
		user_type = 'worker',
		( SELECT user_imgUrl FROM worker WHERE users.username = worker.username ),(
		SELECT
			user_imgUrl 
		FROM
			recruiter 
		WHERE
			users.username = recruiter.username 
		)) AS user_imgUrl,
IF
	(
		user_type = 'worker',
		( SELECT worker_name FROM worker WHERE users.username = worker.username ),(
		SELECT
			recruiter_name 
		FROM
			recruiter 
		WHERE
			users.username = recruiter.username 
		)) AS true_name,
IF
	(
		user_type = 'worker',
		( SELECT worker_sex FROM worker WHERE users.username = worker.username ),(
		SELECT
			recruiter_sex 
		FROM
			recruiter 
		WHERE
			users.username = recruiter.username 
		)) AS sex,
IF
	(
		user_type = 'worker',
		( SELECT worker_phone FROM worker WHERE users.username = worker.username ),(
		SELECT
			recruiter_phone 
		FROM
			recruiter 
		WHERE
			users.username = recruiter.username 
		)) AS phone,
	register_time 
FROM
	users 
WHERE
	user_type REGEXP '^worker|recruiter$' 
ORDER BY
	register_time DESC";
} else {
    $keyword = '%' . $keyword . '%';
    $sql = "SELECT
	user_id,
	users.username,
	IF
	( user_type = 'worker', '个人用户', '企业用户' ) AS user_type,
IF
	(
		user_type = 'worker',
		( SELECT user_imgUrl FROM worker WHERE users.username = worker.username ),(
		SELECT
			user_imgUrl 
		FROM
			recruiter 
		WHERE
			users.username = recruiter.username 
		)) AS user_imgUrl,
IF
	(
		user_type = 'worker',
		( SELECT worker_name FROM worker WHERE users.username = worker.username ),(
		SELECT
			recruiter_name 
		FROM
			recruiter 
		WHERE
			users.username = recruiter.username 
		)) AS true_name,
IF
	(
		user_type = 'worker',
		( SELECT worker_sex FROM worker WHERE users.username = worker.username ),(
		SELECT
			recruiter_sex 
		FROM
			recruiter 
		WHERE
			users.username = recruiter.username 
		)) AS sex,
IF
	(
		user_type = 'worker',
		( SELECT worker_phone FROM worker WHERE users.username = worker.username ),(
		SELECT
			recruiter_phone 
		FROM
			recruiter 
		WHERE
			users.username = recruiter.username 
		)) AS phone,
	register_time 
FROM
	users 
WHERE
	user_type REGEXP '^worker|recruiter$' 
	AND username like '$keyword'
ORDER BY
	register_time DESC";
}
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while ($row = mysqli_fetch_assoc($result)) {
        $user = new Users();
        $user->user_id = $row["user_id"];
        $user->username = $row["username"];
        $user->user_type = $row["user_type"];
        $user->user_imgUrl = $row["user_imgUrl"];
        $user->true_name = $row["true_name"];
        $user->sex = $row["sex"];
        $user->phone = $row["phone"];
        $user->register_time = $row["register_time"];
        $data[] = $user;
    }
    $json = json_encode($data);
    echo "{" . '"user"' . ":" . $json . "}";
} else {
    echo "0";
}

mysqli_close($conn);

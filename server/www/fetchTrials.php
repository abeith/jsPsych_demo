<?php

require_once(__DIR__ . '/private/dbConnect.php');
$dbCon = new dbConnect();
$pdo = $dbCon->getPDO();

$query = "SELECT * FROM item_strings";

$sth = $pdo->query($query);

$result = $sth->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);

?>

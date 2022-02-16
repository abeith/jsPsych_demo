<?php

require_once(__DIR__ . '/private/dbConnect.php');
$dbCon = new dbConnect();
$pdo = $dbCon->getPDO();

$post_json = json_decode(file_get_contents('php://input'), true);

$query = "INSERT INTO surveyResp ";
$query .= "(question, response) ";
$query .= "VALUES (:question, :response)";

$stmt = $pdo->prepare($query);

try{

    foreach($post_json as $question => $response){

        $data = array(
            ':question' => $question,
            ':response' => $response
            );

        $stmt->execute($data);
    }

    header('Content-Type: application/json');
    echo json_encode(array('success' => TRUE));
}catch(PDOException $e){
    http_response_code(500);
    echo $e->getMessage();
};

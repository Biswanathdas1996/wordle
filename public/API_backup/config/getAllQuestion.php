<?php
include('query.php');
    
    $session_id= $_GET['session_id'];
    
    $get_data=select('questions',[
            "conditions"=>[
                "session_id"=>$session_id
                ]
        ]);

echo json_encode($get_data);


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
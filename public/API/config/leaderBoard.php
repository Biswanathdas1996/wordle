<?php
include('query.php');

    
    $response =[];

    $get_data=select('users');
     
     foreach($get_data as $user){
        $get_user_game=select('game', array(
          "conditions"=>array(
                            "user_id"=>$user['id']
                        )    
        ));
        $final_score=0;
        foreach($get_user_game as $d){
            $score=0;
            if($d['correct_attempt'] === '0'){
              $score = 6;  
            }else{
                $score = $d['correct_attempt'];
            }
            
            $final_score+=$score;
        }
        
        if($final_score !== 0){
           $f_data = [
            "user"=>$user['id'],
            "name"=>$user['name'],
            "contact_no"=>$user['contact_number'],
            "score"=>$final_score
            ];
             array_push($response, $f_data);
        }
        
       
     
     
     }
     
    
 echo json_encode($response);



header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

?>  
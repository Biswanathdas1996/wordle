<?php
include('query.php');


          $get_data=select('questions');
            foreach($get_data as $que){
                
               if($que['status'] === '1'){
                   $data=array(
                    "data"=>array(
                        "status"=>2
                    )
                );
                $update_data=update('questions',$data,$que['id']);
               }
                
                
                
           }

    

        $id=$_POST['id'];
        $current_time= time();
        if($_POST){
        $data=array(
            "data"=>array(
                     "status"=>1,
                     "start_time"=>$current_time,
                     "end_time"=>$current_time+(60*5),
                )
            );
            $update_data=update('questions',$data,$id);
        }



       echo $id; 





header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

?>  
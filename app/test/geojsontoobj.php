<?php 

$json_string = file_get_contents('primarii-ro.json');
print_r(json_decode( $json_string ));
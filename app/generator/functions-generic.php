<?php

function saveFile($data, $path_to_file)
{
    $ret = file_put_contents($path_to_file, $data, LOCK_EX);
    if ($ret === false) {
        die('There was an error writing this file');
    } else {
        echo round($ret/1024000, 2)." Mb → ".basename($path_to_file)." ";
    }
}

function pr($array, $is_shy = 0, $style = 'array')
{
    $shy='';
    if ($is_shy) {
        $shy='shy';
    }
    echo '<pre class="print_r '.$shy.'" onclick="this.classList.toggle(\'shy\')"><mark>'.print_var_name($array).'</mark><div>';
    switch ($style) {
        case 'dump':
            var_dump($array);
        case 'export':
            var_export($array);
        default:
            print_r($array);
    }
    echo '</div></pre>';
}

function print_var_name($var)
{
    foreach ($GLOBALS as $var_name => $value) {
        if ($value === $var) {
            return $var_name;
        }
    }

    return false;
}



// modified from http://stackoverflow.com/a/23517532/107671
function seoUrl($string)
{
    //Lower case everything
    $string = strtolower($string);
    //Make alphanumeric (removes all other characters)
    $string = preg_replace("/[^a-z0-9_\s-]/", "", $string);
    //Clean up multiple dashes or whitespaces
    $string = preg_replace("/[\s-]+/", " ", $string);
    //Clean up whitespaces and underscores
    $string = preg_replace("/[\s_]/", "", $string);
    return $string;
}


// Fixes weirdly encoded input
function sanitizeText($input)
{
    // $output = '<mark>'.mb_detect_encoding($input).'</mark>'.$input;
    $encoding = mb_detect_encoding($input);
    if ($encoding) {
        $output=$input;
    } elseif ($encoding=='ASCII') {
        $output=htmlentities(mb_convert_encoding($input, 'UTF-8', 'auto'), ENT_SUBSTITUTE, "UTF-8");
    } elseif ($encoding=='UTF-8') {
        $output=htmlentities($input, ENT_SUBSTITUTE, "UTF-8");
    }
    // return '<small><mark>'.$encoding.'</mark></small>'.$output;
    // return iconv(mb_detect_encoding($input, mb_detect_order(), true), "UTF-8", $input);
    return $input;
}



/**
 * Tracking the script execution time in PHP
 * http://stackoverflow.com/q/535020/107671
 */

function rutime($ru, $rus, $index)
{
        return ($ru["ru_$index.tv_sec"]*1000 + intval($ru["ru_$index.tv_usec"]/1000))
         -  ($rus["ru_$index.tv_sec"]*1000 + intval($rus["ru_$index.tv_usec"]/1000));
}


function human_filesize($bytes, $decimals = 2)
{
    $size = array('B','kB','MB','GB','TB','PB','EB','ZB','YB');
    $factor = floor((strlen($bytes) - 1) / 3);
    return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$size[$factor];
}

function secondsToTime($seconds)
{
    $dtF = new DateTime("@0");
    $dtT = new DateTime("@$seconds");
    $seconds = $dtF->diff($dtT)->format('%s');
    $minutes = $dtF->diff($dtT)->format('%i');
    $hours = $dtF->diff($dtT)->format('%h');
    $days = $dtF->diff($dtT)->format('%a');

    if ($days) {
        $out.=$days.' days ';
    } elseif ($hours) {
        $out.=$hours.' hours ';
    } else {
        if ($minutes) {
            $out.=$minutes.'m ';
        }
        if ($seconds) {
            $out.=$seconds.'s ';
        }
    }
    return $out;
   // return $dtF->diff($dtT)->format('%a d, %h h, %i m and %s s');
}

// function shift_coords(&$value, $key)
// {
//     $value+= 10.001;
// }

// function shift_coords($x)
// {
//     return ($x+10.001);
// }


// function shift_coords(&$item, $key, $ammount)
// {
//     $item1 = $item+=$ammount;
// }


/**
 * Calculate a new coordinate based on start, distance and bearing
 *
 * @param $start array - start coordinate as decimal lat/lon pair
 * @param $dist  float - distance in kilometers
 * @param $brng  float - bearing in degrees (compass direction)
 * source: https://www.cosmocode.de/en/blog/gohr/2010-06/29-calculate-a-destination-coordinate-based-on-distance-and-bearing-in-php
 */
function geo_destination($start, $dist, $brng)
{
    $lat1 = toRad($start[0]);
    $lon1 = toRad($start[1]);
    $dist = $dist/6371.01; //Earth's radius in km
    $brng = toRad($brng);
 
    $lat2 = asin(sin($lat1)*cos($dist) +
                  cos($lat1)*sin($dist)*cos($brng));
    $lon2 = $lon1 + atan2(
        sin($brng)*sin($dist)*cos($lat1),
        cos($dist)-sin($lat1)*sin($lat2)
    );
    $lon2 = fmod(($lon2+3*pi()), (2*pi())) - pi();
 
    return array(toDeg($lat2),toDeg($lon2));
}
function toRad($deg)
{
    return $deg * pi() / 180;
}
function toDeg($rad)
{
    return $rad * 180 / pi();
}


/*
  Writes $data (string) to $file
 */

function writeFile($file, $data, $echo = true)
{
    $ret = file_put_contents($file, $data, LOCK_EX);
    if ($ret === false) {
        die('There was an error writing this file');
    } else {
        if ($echo) {
            echo "<br><b>".round($ret/1000, 2)." Kb</b> &rarr; <code><a href=\"".$file."\">".$file."</a></code>";
        }
    }
}

<?php
/*
    ASSIGNS COORDINATES TO PARTICIPARE $participare_json
*/

$rustart = getrusage();

/*
    CONSTANTS
*/

$participare_json='../../data/generated/participare-sectii.json';
$gis_csv='../../data/gis/ro_localitati_punct-min.csv';
$target_json='../../data/generated/sectii.json';
$prezenta_observatori='../../data/observatori.csv';

require('functions.php');


/*
    parse OBServatori
 */
$observatori = file($prezenta_observatori, FILE_IGNORE_NEW_LINES);
array_walk($observatori, 'trim_spaces');
function trim_spaces(&$item, $key)
{
    $item=str_replace(' ', '', $item);
}

// load json into obj
$participare_data = file_get_contents($participare_json);
$participare_obj = json_decode($participare_data);

// load GIS csv into array
$gis_arr = [];
$gis_data_arr=csv_to_array($gis_csv);

foreach ($gis_data_arr as $one_loc) {
    $gis_arr[$one_loc['siruta']]['name']=$one_loc['name'];
    $gis_arr[$one_loc['siruta']]['judet']=$one_loc['judet'];
    $gis_arr[$one_loc['siruta']]['coordinates']=[round($one_loc['long'], 3), round($one_loc['lat'], 3)];
}


$geojson= new \stdClass();
$geojson->type='FeatureCollection';
$geojson->features=[];
foreach ($participare_obj as $siruta => $one_loc) {
    if (isset($gis_arr[$siruta])) {
        $ii=0;
        foreach ($one_loc->sectii as $nr_sectie => $one_sectie) {
            $onePoint= new \stdClass();
            $onePoint->type='Feature';
            $onePoint->geometry=new \stdClass();
            $onePoint->geometry->type='Point';
            $onePoint->props = new \stdClass();
            $onePoint->props->siruta = $siruta;
            $onePoint->props->jud = $participare_obj->$siruta->county;
            $onePoint->props->localitate = $participare_obj->$siruta->localitate;
            $onePoint->geometry->coordinates=new \stdClass();
            /*
                SLIGHTLY SHIFT COORDINATES
                build a spiral, increment distance and bearing on each sectie in same siruta
            */

            // $onePoint->geometry->coordinates = $gis_arr[$siruta]['coordinates'];
            // array_walk($gis_arr[$siruta]['coordinates'], "shift_coords", 0.0003);

            // https://www.cosmocode.de/en/blog/gohr/2010-06/29-calculate-a-destination-coordinate-based-on-distance-and-bearing-in-php
            $ii = $ii > 360 ? 0 : $ii+2; // dumb degrees incrementer
            $onePoint->geometry->coordinates = geo_destination($gis_arr[$siruta]['coordinates'], $ii/75, $ii*3);
            $onePoint->props->nr = $nr_sectie;
            $onePoint->props->nume = $one_sectie->{'nume sectie'};
            $onePoint->props->pe_lista = $one_sectie->{'pe lista'};
            $onePoint->props->ts = new \stdClass();
            foreach ($one_sectie->ts as $ts => $one_ts) {
                $onePoint->props->ts->$ts = new \stdClass();
                foreach ($one_ts as $varName => $value) {
                    $onePoint->props->ts->$ts->$varName = $value;
                }
            }
            //  check if observatori
            if (in_array($participare_obj->$siruta->county.$nr_sectie, $observatori)) {
                $onePoint->props->observatori = 'da';
            }

            $zz = clone $onePoint;
            array_push($geojson->features, $zz);
        }
    }
}


// https://stackoverflow.com/questions/1390983/php-json-encode-encoding-numbers-as-strings
// saveFile(json_encode($geojson, JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT), $target_json);
saveFile(json_encode($geojson, JSON_NUMERIC_CHECK), $target_json);

echo '<style>body{font-family: sans-serif; padding: 5%;}.print_r{font-size: 12px;}</style>';


$ru = getrusage();
echo '<p><small><b>'.rutime($ru, $rustart, "utime") . "</b> ms computations;\n<b>". rutime($ru, $rustart, "stime") . "</b> ms sys calls</small></p>\n";
echo '<a href="index.html">back</a> | <a href="../../index.html">front</a>';

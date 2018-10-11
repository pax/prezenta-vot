<?php
/*
    ASSIGNS COORDINATES TO PARTICIPARE $participare_json
*/

$rustart = getrusage();

/*
    CONSTANTS
*/

$participare_json='../../data/generated/participare.json';
$gis_csv='../../data/gis/ro_localitati_punct-min.csv';
$target_json='../../data/generated/sectii.json';

require('functions.php');

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
            */

            // $onePoint->geometry->coordinates = array_map('shift_coords', $gis_arr[$siruta]['coordinates']);
            $onePoint->geometry->coordinates = $gis_arr[$siruta]['coordinates'];
            array_walk($gis_arr[$siruta]['coordinates'], "shift_coords", 0.0003);
            // array_walk($onePoint->geometry->coordinates, 'shift_coords', 0.001*$ii);

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

            $zz = clone $onePoint;
            array_push($geojson->features, $zz);
            unset($zz);
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

<style>body{font-family: sans-serif; padding: 5%;}.print_r{font-size: 12px;}</style>
<?php
$rustart = getrusage();
require('functions.php');
$participare_json='../data/generated/participare.json';
$gis_csv='../data/ro_localitati_punct-min.csv';
$target_json='../data/generated/localitati.json';

// load json into obj

$participare_data = file_get_contents($participare_json);
$participare_obj = json_decode($participare_data);

// load GIS csv into array
$gis_arr = [];
$gis_data_arr=csv_to_array($gis_csv);

foreach ($gis_data_arr as $one_loc) {
  $gis_arr[$one_loc['siruta']]['name']=$one_loc['name'];
  $gis_arr[$one_loc['siruta']]['judet']=$one_loc['judet'];
  $gis_arr[$one_loc['siruta']]['coordinates']=[$one_loc['long'], $one_loc['lat']];
}


// assign coordinates to participare

$geojson= new \stdClass();
$geojson->type='FeatureCollection';
$geojson->features=[];
foreach ($participare_obj as $siruta => $one_loc) {
  if (isset($gis_arr[$siruta])) {
    // pr($participare_obj->$siruta);
    // break;
  $onePoint= new \stdClass();
  $onePoint->type='Feature';
  $onePoint->geometry=new \stdClass();
  $onePoint->geometry->type='Point';
  // $onePoint->geometry->coordinates = isset($gis_arr[$siruta]) ? $gis_arr[$siruta]['coordinates'] : 'no coords:'.$siruta;
  $onePoint->geometry->coordinates = isset($gis_arr[$siruta]) ? $gis_arr[$siruta]['coordinates'] : null;
  $onePoint->props=new \stdClass();
  
  foreach ($participare_obj->$siruta->sectii as $nr_sectie => $oSectie) {

  // $onePoint->props->localitate=$participare_obj->$siruta->{'Nr sectie de votare'}->{'localitate'};
  // $onePoint->props->jud=$participare_obj->$siruta->{'Nr sectie de votare'}->{'county'};

    $onePoint->props->$siruta =new \stdClass();
    $onePoint->props->$siruta->sectii =new \stdClass();
    $onePoint->props->$siruta->sectii->$nr_sectie =new \stdClass();
    $onePoint->props->$siruta->sectii->$nr_sectie->nume_sectie=$oSectie->{'nume sectie'};
    $onePoint->props->$siruta->sectii->$nr_sectie->pe_lista=$oSectie->{'pe lista'};
    $onePoint->props->$siruta->sectii->$nr_sectie->ts = new \stdClass();
    // pr($oSectie);
    // break;

    foreach ($oSectie->ts as $xts => $participare) {
      $onePoint->props->$siruta->sectii->$nr_sectie->ts->$xts = new stdClass();
      foreach ($participare as $xkey => $value) {
        $onePoint->props->$siruta->sectii->$nr_sectie->ts->$xts->$xkey=$value;
      }
    }
  }
  
 
  array_push($geojson->features, $onePoint);
  // unset($onePoint);
  }
}

// pr($geojson);
// https://stackoverflow.com/questions/1390983/php-json-encode-encoding-numbers-as-strings
saveFile(json_encode( $geojson, JSON_NUMERIC_CHECK  ), $target_json);
$ru = getrusage();
echo '<p><small><b>'.rutime($ru, $rustart, "utime") . "</b> ms computations;\n<b>". rutime($ru, $rustart, "stime") . "</b> ms sys calls</small></p>\n";
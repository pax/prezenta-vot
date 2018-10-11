<style>body{font-family: sans-serif; padding: 5%;}.print_r{font-size: 12px;}</style>
<?php
$rustart = getrusage();
require('functions.php');
$localitati_json='../../data/generated/localitati.json';
$target_csv='../../data/generated/localitati.csv';

// load json into obj

$localitati_data = file_get_contents($localitati_json);
$localitati_obj = json_decode($localitati_data);
$ii=0;
foreach ($localitati_obj->features as $oLocalitate) {
  // pr($oLocalitate);
  // break;
  $csvArr[$ii]['nume'] = $oLocalitate->props->localitate;
  $csvArr[$ii]['jud'] = $oLocalitate->props->jud;
  $csvArr[$ii]['pe_lista'] = $oLocalitate->props->pe_lista;
  foreach ($oLocalitate->props->total as $ts => $tsData) {
    foreach ($tsData as $key => $value) {
      $csvArr[$ii][$ts.' '.$key]= $value;
    }
  }
  $ii++;
}

// array_unshift($csvArr, $headRow);
// pr($csvArr);
// exit();

// https://stackoverflow.com/questions/1390983/php-json-encode-encoding-numbers-as-strings

array_to_csv($csvArr, $target_csv);
// saveFile(json_encode( $geojson, JSON_NUMERIC_CHECK  ), $target_json);
$ru = getrusage();
echo '<p><small><b>'.rutime($ru, $rustart, "utime") . "</b> ms computations;\n<b>". rutime($ru, $rustart, "stime") . "</b> ms sys calls</small></p>\n";
echo '<a href="index.html">back</a>';
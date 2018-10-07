<style>body{font-family: sans-serif; padding: 5%;}.print_r{font-size: 12px;}</style>
<?php
$rustart = getrusage();
require('functions.php');
$source_csv_dir='../data/sources/';
$target_csv='../data/generated/participare.csv';
$target_json='../data/generated/participare.json';

$ze_csvs = glob($source_csv_dir."*.csv");

foreach ($ze_csvs as $oneCsv) {

  $trimestamps=explode('-', $oneCsv);
  $csv[$trimestamps[2]]=csv_to_array($oneCsv);
  echo '<br/>-'.$oneCsv.' <em>'.count($csv[$trimestamps[2]]). '</em> rows';
}
$masterData = [];

// pr($csv);

foreach ($csv as $timestamp => $oneCsv) {
  // $masterData[$timestamp]=[];
  foreach ($oneCsv as $rowno => $row) {
    // pr($row);
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['siruta']=$row['Siruta'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['nr sectie']=$row['Nr sectie de votare'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['nume sectie']=$row['Nume sectie de votare'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['localitate']=$row['Localitate'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['county']=$row['﻿Judet'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['pe lista']=$row['Votanti lista'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['LP_'.$timestamp]=$row['LP'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['LS_'.$timestamp]=$row['LS'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['UM_'.$timestamp]=$row['UM'];
    $masterData[$row['Siruta'].'_'.$row['Nr sectie de votare']]['LT_'.$timestamp]=$row['LT'];
  }
}

echo '<p>masterdata:  '.count($masterData).' rows</p>';
// arraty →  csv → file

// pr($masterData);

// saveFile(json_encode( $masterData ), $target_json);

array_to_csv($masterData, $target_csv);



$ru = getrusage();
echo '<p><small><b>'.rutime($ru, $rustart, "utime") . "</b> ms computations;\n<b>". rutime($ru, $rustart, "stime") . "</b> ms sys calls</small></p>\n";
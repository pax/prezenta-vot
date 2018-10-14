<style>body{font-family: sans-serif; padding: 5%;}.print_r{font-size: 12px;}</style>
<?php
$rustart = getrusage();
require('functions.php');
$source_csv_dir='../../data/sources/';
$target_json='../../data/generated/participare.json';
$timestamps_index='../../data/generated/timestamps.json';

$ze_csvs = glob($source_csv_dir."*.csv");

// pr($ze_csvs);
// exit;
$index_var=[];
foreach ($ze_csvs as $oneCsv) {

    $trimestamps=explode('-', $oneCsv);
    $csv[$trimestamps[2]]=csv_to_array($oneCsv);
    echo '<br/>&rarr; <code><b>'.$trimestamps[2].'</b></code> <em>'.count($csv[$trimestamps[2]]). '</em> rows';
    $index_var[]=$trimestamps[2];
}


writeFile($timestamps_index, json_encode($index_var));

$masterData = [];

// pr($csv);

foreach ($csv as $timestamp => $oneCsv) {
  // $masterData[$timestamp]=[];
    foreach ($oneCsv as $rowno => $row) {
      // pr($row);
      // break;

        $masterData[$row['Siruta']]['localitate']=$row['Localitate'];
        $masterData[$row['Siruta']]['county']=$row['﻿Judet'];
        $masterData[$row['Siruta']]['sectii'][$row['Nr sectie de votare']]['pe lista']=$row['Votanti lista'];
        $masterData[$row['Siruta']]['sectii'][$row['Nr sectie de votare']]['nume sectie']=$row['Nume sectie de votare'];
      // $masterData[$row['Siruta']]['sectii'][$row['Nr sectie de votare']]['nume']=$row['Votanti lista'];
        $masterData[$row['Siruta']]['sectii'][$row['Nr sectie de votare']]['ts'][$timestamp]['LP']=$row['LP'];
        $masterData[$row['Siruta']]['sectii'][$row['Nr sectie de votare']]['ts'][$timestamp]['LS']=$row['LS'];
        $masterData[$row['Siruta']]['sectii'][$row['Nr sectie de votare']]['ts'][$timestamp]['UM']=$row['UM'];
        $masterData[$row['Siruta']]['sectii'][$row['Nr sectie de votare']]['ts'][$timestamp]['LT']=$row['LT'];
    }
}

echo '<p>masterdata:  '.count($masterData).' rows</p>';
// arraty →  csv → file

// pr($masterData);

// saveFile(json_encode($masterData, JSON_PRETTY_PRINT), $target_json);
saveFile(json_encode($masterData), $target_json);

// array_to_csv($masterData, $target_csv);



$ru = getrusage();
echo '<p><small><b>'.rutime($ru, $rustart, "utime") . "</b> ms computations;\n<b>". rutime($ru, $rustart, "stime") . "</b> ms sys calls</small></p>\n";
echo '<a href="index.html">back</a>';

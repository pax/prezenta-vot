<?php

$source_file='../../data/generated/localitati.csv';
$target_file='../../data/generated/sectii.lz.txt';

require_once 'vendor/autoload.php';
// use LZCompressor\LZString as LZ;
// use LZCompressor\LZUtil as Util;

$input_string = file_get_contents($source_file);
$compressed=\LZCompressor\LZString::compressToBase64($input_string);
// echo $compressed;
saveFile($compressed, $target_file);

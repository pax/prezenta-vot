<style>body{font-family: sans-serif; padding: 5%;}.print_r{font-size: 12px;}</style>
<?php
$rustart = getrusage();
require('functions.php');



$ru = getrusage();
echo '<p><small><b>'.rutime($ru, $rustart, "utime") . "</b> ms computations;\n<b>". rutime($ru, $rustart, "stime") . "</b> ms sys calls</small></p>\n";
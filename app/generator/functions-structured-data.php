<?php



/**
 * CSV functions
 */

function dump_csv($data, $row_numbers=false, $col_letters=false, $sheet=0, $table_class='excel')
		{
				$outs = array();
				for($row=1; $row<=$data->rowcount($sheet); $row++)
				{
						$outs_inner = array();
						for($col=1; $col<=$data->colcount($sheet); $col++)
						{
								// Account for Rowspans/Colspans
								$rowspan = $data->rowspan($row, $col, $sheet);
								$colspan = $data->colspan($row, $col, $sheet);
								for($i=0; $i<$rowspan; $i++)
								{
										for($j=0; $j<$colspan; $j++)
										{
												if ($i>0 || $j>0)
												{
														$data->sheets[$sheet]['cellsInfo'][$row+$i][$col+$j]['dontprint']=1;
												}
										}
								}

								if(!$data->sheets[$sheet]['cellsInfo'][$row][$col]['dontprint'])
								{
										$val = $data->val($row, $col, $sheet);
										$val = ($val=='')?'':addslashes(htmlentities($val));
										$outs_inner[] = "\"{$val}\""; # Quote or not?
										#$outs_inner[] = $val;
								}
						}
						$outs[] = implode(',', $outs_inner);
				}
				$out = implode("\r\n", $outs);
				return($out);
		}


function parse_csv ($csv_string, $delimiter = ",", $skip_empty_lines = true, $trim_fields = true)
{
	return array_map(
		function ($line) use ($delimiter, $trim_fields) {
			return array_map(
				function ($field) {
					return str_replace('!!Q!!', '"', utf8_decode(urldecode($field)));
				},
				$trim_fields ? array_map('trim', explode($delimiter, $line)) : explode($delimiter, $line)
			);
		},
		preg_split(
			$skip_empty_lines ? ($trim_fields ? '/( *\R)+/s' : '/\R+/s') : '/\R/s',
			preg_replace_callback(
				'/"(.*?)"/s',
				function ($field) {
					return urlencode(utf8_encode($field[1]));
				},
				$enc = preg_replace('/(?<!")""/', '!!Q!!', $csv_string)
			)
		)
	);
}


function csv_to_array ($file)
{

	$csv = array_map("str_getcsv", file($file,FILE_SKIP_EMPTY_LINES));
	$keys = array_shift($csv);

	foreach ($csv as $i=>$row) {
		$csv[$i] = array_combine($keys, $row);
	}
	return $csv;
}


function csv2array ($file) { //csv to array with column name row removed
	$csv = array_map("str_getcsv", file($file,FILE_SKIP_EMPTY_LINES));
	$keys = array_shift($csv);

	foreach ($csv as $i=>$row) {
	$zekeys[] = $row [0];
		$csv[$i] = array_combine($keys, $row);
	}
	$finalCsv = array_combine($zekeys, $csv);
	return $finalCsv;
}

function pivotCSV_array ($array){
	foreach ($array as $key1 => $subArr) {
		foreach ($subArr as $key2 => $value) {
			$transposed[$key2][$key1]=$value;
		}
	}
	return $transposed;
}

/**
 *		ARRAY functions
 */

/**
 *		converts OBJECT to ARRAY
 */
function dumptoarray($xlsObj, $sheet=0) {
		$arr = array();

		for($row=1;$row<=$xlsObj->rowcount($sheet);$row++)
				for($col=1;$col<=$xlsObj->colcount($sheet);$col++)
						$arr[$row][$col] = $xlsObj->val($row,$col,$sheet);

		return $arr;
}


function json_to_array($filename='', $delimiter=',')
{
		if(!file_exists($filename) || !is_readable($filename))
			return FALSE;

	$handle = fopen($filename, "rb");
	$contents = stream_get_contents($handle);
	fclose($handle);
	$zeJson = json_decode($contents);

	return $zeJson;

}

function removeEmptyKeys(&$array) {
	unset($array['']);
}

function arrayTrim ($array) { // remove first element of array
	array_shift($array);
	return $array;
}

function array_transpose($array, $selectKey = false) {
	if (!is_array($array)) return false;
	$return = array();
	foreach($array as $key => $value) {
		if (!is_array($value)) return $array;
		if ($selectKey) {
			if (isset($value[$selectKey])) $return[] = $value[$selectKey];
		} else {
			foreach ($value as $key2 => $value2) {
				$return[$key2][$key] = $value2;
			}
		}
	}
	return $return;
}


function transpose($array) {
	array_unshift($array, null);
	return call_user_func_array('array_map', $array);
}


function array_to_csv($arr, $path_to_csv) {
// how to get column names
// pr($arr);
	$fp = fopen($path_to_csv, 'w');
	fputcsv($fp, array_keys(current($arr)));
	foreach ($arr as $fields) {
// echo 's';
		// pr(array_keys($fields));

	    fputcsv($fp, $fields);
	}
	fclose($fp);
	echo '<p><b>'.human_filesize(filesize($path_to_csv)).'</b> → <em>'.basename($path_to_csv).'</em></p>';
}

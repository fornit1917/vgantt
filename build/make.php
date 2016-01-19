<?php

$gcc = '../../gcc/compiler.jar';
$readyDir = '../dist';
$hostDir  = 'Z:/home/test1.ru/www/vgantt';
$index    = '../index.html';

$files = array (
	
	'../src/g_Config.js',
	
	'../src/utils/globals.js',
	'../src/utils/events.js',
	'../src/utils/Ajax.js',
	'../src/utils/JSON.js',
	'../src/utils/Search.js',
	
	'../src/calendar/CellProto.js',
	'../src/calendar/CellYQ.js',
	'../src/calendar/CellQM.js',
	'../src/calendar/CellMW.js',
	'../src/calendar/CellMD.js',
	'../src/calendar/CellWD.js',
	'../src/calendar/CellFactory.js',
	'../src/calendar/Calendar.js',
	
	'../src/tasks/Task.js',
	'../src/tasks/Project.js',
	'../src/tasks/TasksCanvas.js',
	'../src/tasks/Tasks.js',
	
	
	
	'../src/scaling.js',
	'../src/main.js'
);

$n    = count($files);
$code = '';
for ($i=0; $i<$n; $i++) {
	
	echo "{$files[$i]}\r\n";
	$code .= file_get_contents($files[$i]) . "\r\n";
}

$code = "(function(){\r\n$code})();";
file_put_contents("$readyDir/vgantt.js", $code);


exec("\"C:\\Program Files\\Java\\jre7\\bin\\java.exe\" -jar $gcc --js $readyDir/vgantt.js --js_output_file $readyDir/vgantt.min.js");
copy($index, "$hostDir/index.html");
copy("$readyDir/vgantt.js", "$hostDir/vgantt.js");

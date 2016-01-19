<?php

$arr = array(
	array(
		'name'  => 'test proj',
		'id'    => '123',
		'tasks' => array(
			array(
				'dt1'  => '2015-03-07',
				'dt2'  => '2015-03-17',
				'title'=> 'task 1'
			),

			array(
				'dt1'  => '2015-03-13',
				'dt2'  => '2015-03-14',
				'title'=> 'task 2'
			),

			array(
				'dt1'  => '2015-03-11',
				'dt2'  => '2015-03-25',
				'title'=> 'task 3'
			),

			array(
				'dt1'  => '2015-03-12',
				'dt2'  => '2015-03-21',
				'title'=> 'task 4'
			),

			array(
				'dt1'  => '2015-03-27',
				'dt2'  => '2015-03-29',
				'title'=> 'task 5'
			),
		)
	),

	array(
		'name' => 'Project number 2',
		'id'   => '2',
		'tasks'=> array(
			array(
				'dt1'  => '2015-03-01',
				'dt2'  => '2015-03-29',
				'title'=> 'big task!'
			),
		)
	),

	array(
		'name'  => 'test proj',
		'id'    => '123',
		'tasks' => array(
			array(
				'dt1'  => '2015-03-07',
				'dt2'  => '2015-03-17',
				'title'=> 'task 21'
			),

			array(
				'dt1'  => '2015-03-13',
				'dt2'  => '2015-03-14',
				'title'=> 'task 22'
			),

			array(
				'dt1'  => '2015-03-11',
				'dt2'  => '2015-03-25',
				'title'=> 'task 23'
			),

			array(
				'dt1'  => '2015-03-12',
				'dt2'  => '2015-03-21',
				'title'=> 'task 24'
			),

			array(
				'dt1'  => '2015-03-27',
				'dt2'  => '2015-03-29',
				'title'=> 'task 25'
			),
		)
	),

	array(
		'name'  => 'test proj',
		'id'    => '123',
		'tasks' => array(
			array(
				'dt1'  => '2015-03-01',
				'dt2'  => '2015-03-11',
				'title'=> 'task 31'
			),

			array(
				'dt1'  => '2015-03-11',
				'dt2'  => '2015-03-14',
				'title'=> 'task 32'
			),

			array(
				'dt1'  => '2015-03-20',
				'dt2'  => '2015-03-25',
				'title'=> 'task 33'
			),

			array(
				'dt1'  => '2015-03-12',
				'dt2'  => '2015-03-16',
				'title'=> 'task 34'
			),

			array(
				'dt1'  => '2015-03-27',
				'dt2'  => '2015-03-30',
				'title'=> 'task 35'
			),
		)
	),

	array(
		'name'  => 'test proj',
		'id'    => '123',
		'tasks' => array(
			array(
				'dt1'  => '2015-03-07',
				'dt2'  => '2015-03-11',
				'title'=> 'task 41'
			),

			array(
				'dt1'  => '2015-03-13',
				'dt2'  => '2015-03-14',
				'title'=> 'task 42'
			),

			array(
				'dt1'  => '2015-03-14',
				'dt2'  => '2015-03-25',
				'title'=> 'task 43'
			),

			array(
				'dt1'  => '2015-03-15',
				'dt2'  => '2015-03-21',
				'title'=> 'task 44'
			),

			array(
				'dt1'  => '2015-03-25',
				'dt2'  => '2015-03-29',
				'title'=> 'task 45'
			),
		)
	),

);

echo json_encode($arr);

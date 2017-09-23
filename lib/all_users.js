jQuery(function($) {
	function set_form() {
		var list = [
			'420713',
			'397484',
			'393926',
			'404607',
			'411079',
			'435421',
			'417703',
			'419255',
			'397577',
			'414778',
			'418322',
			'411267',
			'418390',
			'427635',
			'410140',
			'393295',
			'417926',
			'392427',
			'397661',
			'418455',
			'411422',
			'395139',
		];

		var courses = {
			'420713': 'BIOL-1610',
			'397484': 'BIOL-3500',
			'393926': 'HLTH-3000',
			'404607': 'ZOOL-1090',
			'411079': 'MGMT-1010-001',
			'435421': 'EGDT-1020',
			'417703': 'INFO-3130',
			'419255': 'MGMT-1010-X01',
			'397577': 'FIN-1060',
			'414778': 'CJ-1010',
			'418322': 'CJ-1350',
			'411267': 'CJ-3300',
			'418390': 'ES-1150',
			'427635': 'ESMG-425G',
			'410140': 'CJ-470G',
			'393295': 'COMM-1020',
			'417926': 'RUS-266G',
			'392427': 'PHIL-2050',
			'397661': 'PSY-3400',
			'418455': 'SOC-320G',
			'411422': 'ACC-2020',
			'395139': 'MGMT-330G',
		};

		var option = new Option('Select Course', '');

		$('select').append(option);

		for (var i = 0; i < list.length; i++) {
			var id = list[i];
			var option = new Option(courses[id], id);
			$('select').append(option);
		}

		$('form input').val('Show All Users');
	}

	function set_display_msg() {
		var msg = 'Would you like to show the number of all users?';
		$('form + div').html(msg);
	}

	$('form').submit(function() {
		var course_selected = parseInt($('select option:selected').val());
		var msg1 = 'Pulling data, please wait...';
		var msg2 = 'All users are ';
		var d = {}, a = [];

		$('form input').prop('disabled', true);
		$('form + div').html(msg1);

		$.post('https://mediafiles.uvu.edu/lib/extracted.php', $(this).serialize(), function(data) {
			d = $.parseJSON(data);
			if (d.length === 0) {
				$('form + div').html('No enrollment.');
				return false;
			}

			for (var i in d) {
				var course_id = parseInt(d[i]['course_id']);
				var uid = parseInt(d[i]['user_id']);

				if (a.some(function(m) { return m === uid; }))
					continue;

				if (course_id === course_selected)
					a.push(uid);
			}

			if (a.length === 0 || a.length === 1)
				msg2 = msg2.replace(/users/, 'user').replace(/are/, 'is');

			$('form + div').html(msg2 + a.length + '.');

		}).fail(function() {
			alert('Error!');
		});

		return false;
	});

	$('form > select').change(function() {
		$('form input').prop('disabled', false);
		set_display_msg();
	});

	function init() {
		set_display_msg();
		set_form();
	}

	init();
});

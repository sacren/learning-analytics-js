jQuery(function($) {
	function set_form() {
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

		$.post('https://mediafiles.uvu.edu/lib/t/extracted.php', $(this).serialize(), function(data) {
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

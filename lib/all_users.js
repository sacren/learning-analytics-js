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
		var msg = 'Pulling data, please wait...';

		$('form input').prop('disabled', true);
		$('form + div').html(msg);

		$.post('https://mediafiles.uvu.edu/lib/extracted.php', $(this).serialize(), function(data) {
			var course_selected = parseInt($('select option:selected').val());
			var msg = 'All users are ';
			var d = {}, a = [], n;

			d = $.parseJSON(data);
			if (d.length === 0) {
				$('form + div').html('No enrollment.');
				return false;
			}

			for (var i in d) {
				var course_id = parseInt(d[i]['course_id']);
				var uid = parseInt(d[i]['user_id']);

				if (a.some(function(x) { return x === uid; }))
					continue;

				if (course_id === course_selected)
					a.push(uid);
			}

			n = a.length;
			if (n === 0 || n === 1)
				msg = msg.replace(/users/, 'user').replace(/are/, 'is');

			$('form + div').html(msg + n + '.');

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

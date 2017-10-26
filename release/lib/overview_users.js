jQuery(function($) {
	function set_form() {
		var option = new Option('Select Course', '');

		$('select').append(option);

		for (var i = 0; i < list.length; i++) {
			var id = list[i];
			var option = new Option(courses[id], id);
			$('select').append(option);
		}

		$('form input').val('Show Overview Users');
	}

	function set_display_msg() {
		var msg = 'Would you like to show how many overview users?';
		$('form + div').html(msg);
	}

	$('form').submit(function() {
		var url = 'https://mediafiles.uvu.edu/lib/t/extracted.php';
		var msg = 'Pulling data, please wait...';

		$('form input').prop('disabled', true);
		$('form + div').html(msg);

		$.post(url, $(this).serialize(), function(data) {
			var course_selected = parseInt($('select option:selected').val());
			var msg = 'Overview page users are ';
			var pattern = /overview/i;
			var d = {}, a = [], n = 0;

			d = $.parseJSON(data);
			if (d.length === 0) {
				$('form + div').html('No enrollment.');
				return false;
			}

			for (var i in d) {
				var course_id = parseInt(d[i]['course_id']);
				var uid = parseInt(d[i]['user_id']);
				var req = d[i]['http_request_clean'];

				if (a.some(function(x) { return x === uid; }))
					continue;

				if (course_id === course_selected) {
					a.push(uid);
					if (pattern.test(req))
						n++;
				}
			}

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

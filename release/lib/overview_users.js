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
		var url = 'https://mediafiles.uvu.edu/lib/extracted.php';
		var msg = 'Pulling data, please wait...';

		$('form input').prop('disabled', true);
		$('form + div').html(msg);

		$.post(url, $(this).serialize(), function(data) {
			var course_selected = parseInt($('select option:selected').val());
			var msg = 'users used overview page.';
			var pattern = /overview/i;
			var d = {}, a = [], n;

			d = $.parseJSON(data);
			if (d.length === 0) {
				$('form + div').html('No enrollment.');
				return;
			}

			for (var i in d) {
				var course_id = parseInt(d[i]['course_id']);
				var uid = parseInt(d[i]['user_id']);
				var match = d[i]['http_request_clean'];

				if (course_id !== course_selected)
					continue;

				if (pattern.test(match) &&
				    !a.some(function(x) { return x === uid; }))
					a.push(uid);
			}

			n = a.length;
			if (n === 0) {
				$('form + div').html('No user used overview page.');
				return;
			}

			if (n === 1) {
				$('form + div').html('One user used overview page.');
				return;
			}

			msg = n + ' ' + msg;
			$('form + div').html(msg);

		}).fail(function() {
			alert('Form submission error!');
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

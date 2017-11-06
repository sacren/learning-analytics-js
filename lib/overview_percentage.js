jQuery(function($) {
	function set_form() {
		var option = new Option('Select Course', '');

		$('select').append(option);

		for (var i = 0; i < list.length; i++) {
			var id = list[i];
			var option = new Option(courses[id], id);
			$('select').append(option);
		}

		$('form input').val('Show Percentage');
	}

	function set_display_msg() {
		var msg = 'Would you like to show the overview percentage?';
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
			var d = {}, a = [], b = [], n, m, p;

			d = $.parseJSON(data);
			if (d.length === 0) {
				$('form + div').html('No enrollment.');
				return false;
			}

			for (var i in d) {
				var course_id = parseInt(d[i]['course_id']);
				var uid = parseInt(d[i]['user_id']);
				var match = d[i]['http_request_clean'];

				if (course_id !== course_selected)
					continue;

				if (!a.some(function(x) { return x === uid; }))
					a.push(uid);

				if (pattern.test(match) &&
				    !b.some(function(x) { return x === uid; }))
					b.push(uid);
			}

			n = a.length;
			m = b.length;

			if (n === 0) {
				$('form + div').html('No enrollment.');
				return false;
			}

			if (m === 0) {
				$('form + div').html('No user used overview page.');
				return false;
			}

			if (n === m) {
				$('form + div').html('All ' + msg);
				return false;
			}

			p = m / n * 100;
			msg = p.toPrecision(2) + '% ' + msg;
			$('form + div').html(msg);

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

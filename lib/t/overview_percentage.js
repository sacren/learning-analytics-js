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
		var course_selected = parseInt($('select option:selected').val());
		var msg1 = 'Pulling data, please wait...';
		var msg2 = 'Overview user percentage is ';
		var pattern = /overview/i;
		var d = {}, a = [], b = [];

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
				var req = d[i]['http_request_clean'];

				if (a.some(function(m) { return m === uid; }))
					continue;

				if (course_id === course_selected) {
					a.push(uid);

					if (pattern.test(req))
						b.push(uid);
				}
			}

			if (a.length === 0) {
				$('form + div').html('No enrollment.');
				return false;
			}

			if (b.length === 0) {
				$('form + div').html(msg2 + '0.');
				return false;
			}

			if (a.length === b.length) {
				$('form + div').html(msg2 + '100%.');
				return false;
			}

			d = b.length / a.length * 100;

			$('form + div').html(msg2 + d.toPrecision(2) + '%.');

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

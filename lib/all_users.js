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
		var url = 'https://mediafiles.uvu.edu/lib/extracted.php';
		var msg = 'Pulling data, please wait...';

		$('form input').prop('disabled', true);
		$('form + div').html(msg);

		$.post(url, $(this).serialize(), function(data) {
			var course_selected = parseInt($('select option:selected').val());
			var msg = 'users in total.';
			var d = {}, a = [], n;

			d = $.parseJSON(data);
			if (d.length === 0) {
				$('form + div').html('No enrollment.');
				return false;
			}

			for (var i in d) {
				var course_id = parseInt(d[i]['course_id']);
				var uid = parseInt(d[i]['user_id']);

				if (course_id !== course_selected)
					continue;

				if (!a.some(function(x) { return x === uid; }))
					a.push(uid);
			}

			n = a.length;
			if (n === 0) {
				$('form + div').html('No enrollment.');
				return false;
			}

			if (n === 1) {
				$('form + div').html('One user only.');
				return false;
			}

			msg = n + ' ' + msg;
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

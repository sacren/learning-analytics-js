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
		var msg1 = 'Pulling data, please wait...';
		var msg2 = 'Full enrollment is ';
		var d;

		$('form input').prop('disabled', true);
		$('form + div').html(msg1);

		$.post('https://mediafiles.uvu.edu/lib/all_users.php', $(this).serialize(), function(data) {
			d = $.parseJSON(data);
			$('form + div').html(msg2 + d.length + '.');
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

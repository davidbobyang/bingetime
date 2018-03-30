$(document).ready(function() {

	$('form').submit(function(e) {
		e.preventDefault();
		var input = $('#search-bar').val();
		var id;
		$.ajax({
			type: 'GET',
			url: 'https://api.themoviedb.org/3/search/tv?page=1&language=en-US&api_key=5114cf314283a1d83f54f9684a701572&query=' + input,
			async: false,
			jsonpCallback: 'testing',
			contentType: 'application/json',
			dataType: 'jsonp',

			success: function(json) {
				$('#output').empty();
				document.getElementById('final-output').innerHTML = '';


				var cap = json.results.length;

				if (cap == 0) {
					$('#output').append("<p>oops, we couldn't find anything :(</p>");
				}
				else {
					if (cap > 5) {
						cap = 5;
					}
					for (var i = 0; i < cap; i++) {
						$('#output').append("<a href='javascript:;' class='result' id='" + i + "'></a>");
						document.getElementById(i).innerHTML = json.results[i].name;
					}
				}

				$('#search-results').show();

				document.activeElement.blur();
				
				$('#output a').click(function(event) {
					id = json.results[event.target.id].id;

					$.ajax({
						type: 'GET',
						url: 'https://api.themoviedb.org/3/tv/' + id + '?language=en-US&api_key=5114cf314283a1d83f54f9684a701572',
						async: false,
						jsonpCallback: 'testing',
						contentType: 'application/json',
						dataType: 'jsonp',

						success: function(json) {
							$('#search-results').hide();

							var run_time = json.episode_run_time;
							if (run_time.constructor === Array) {
								run_time = run_time[0];
							}

							var total = json.number_of_episodes * run_time;
							var seasons = json.number_of_seasons;
							var time_per_season = total / seasons;
							var hours = total / 60;
							var days = parseInt(hours / 24);
							var remainder_hours = parseInt(hours) % 24;

							var sentence = json.name + ' takes ';
							if (days != 0) {
								if (days == 1) {
									sentence += days + ' day and ';
								}
								else {
									sentence += days + ' days and ';
								}
							}
							if (remainder_hours == 1) {
								sentence += remainder_hours + ' hour to watch';
							}
							else {
								sentence += remainder_hours + ' hours to watch';
							}

							document.getElementById('final-output').innerHTML = sentence;
						},
						error: function(e) {
							console.log(e.message);
						}
					});
				});
			},
			error: function(e) {
				console.log(e.message);
			}
		});
	});
});
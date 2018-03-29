$(document).ready(function() {
	$('button').click(function() {
		var input = $('#tv').val();
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
				if (cap > 5) {
					cap = 5;
				}
				for (var i = 0; i < cap; i++) {
					$('#output').append("<a href ='#' class='result' id='" + i + "'></a>");
					document.getElementById(i).innerHTML = json.results[i].name;
				}
				
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

						document.getElementById('final-output').innerHTML = name + days + ' days and ' + remainder_hours + ' hours';
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
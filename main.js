/*jshint esversion: 6 */
$(document).ready(function() {
	"use strict";
	$('#results').hide();
	var audioObject;
	// Artist Querying
	

	
	$('#searchButton').click(function() {
		let query = "https://api.spotify.com/v1/search?q=" + $('#artistField').val() + "&type=artist&limit=10";
		$.getJSON(query, function(data) {
			let artistsData = data.artists.items;
			
			console.log(data);
			
			let x = [];
			let y = [];
			
			var imageInfo = [];
			$.each(artistsData, function(index, artist) {
				x[index] = artist.name;
				y[index] = artist.popularity;
				if(artist.images[0] !== undefined &&
				  artist.id !== undefined &&
				  artist.name !== undefined){
					imageInfo[index] = {
					'src': artist.images[0],
					'id': artist.id,
					'name': artist.name
				   };
				}			
			});
			console.log(imageInfo);
			var plotSettings = [{
				x: x,
				y: y,
				type: 'bar',
				margin: {
					l: 50,
					r: 50,
					b: 200,
					t: 100
				},
				autosize:true
			}];

			$('#results').show();

			Plotly.newPlot('plot', plotSettings);
			$("#previews").html("");
			console.log(imageInfo);
			$.each(imageInfo, function(index, image) {
				if(image !== undefined &&
				  image.src !== undefined &&
				  image.src.url !== undefined &&
				  image.id !== undefined &&
				  image.name !== undefined){
					var d = document.createElement('div');
					$(d).attr({
						'id': image.id,
						'class': "cover",
						'style': "background: url('" + image.src.url +"');margin: 20px; height:200px; width:200px; background-size: 80%; repeat: false;"
					});
					$(d).addClass("cover");
					$(d).appendTo("#previews");
				}
			});
		});
	});
	$(document).on('click', '.cover',  function (e) {
		if(audioObject !== undefined){
			audioObject.pause();	
		}
		console.log(e.target.id);
		let query = "https://api.spotify.com/v1/artists/" + e.target.id + "/top-tracks?country=US";
		$.getJSON(query,function(data){
			console.log(data.tracks[0].preview_url);
			audioObject = new Audio(data.tracks[0].preview_url);
			audioObject.play();
		});
	});
});
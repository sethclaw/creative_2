/*jshint esversion: 6 */
$(document).ready(function() {
	"use strict";
	$('#results').hide();
	var audioObject;
	// Artist Querying
	
    $(document).bind('keypress', function(e) {
        if(e.keyCode==13){
             $('#searchButton').trigger('click');
         }
    });
	
	$('#searchButton').click(function() {
		let query = "https://api.spotify.com/v1/search?q=" + $('#artistField').val() + "&type=artist&limit=25";
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
				marker: {         // marker is an object, valid marker keys: #scatter-marker
            		color: 'rgb(36, 255, 55)' // more about "marker.color": #scatter-marker-color
				},
				autosize:true
			}];

			$('#results').show();

			Plotly.newPlot('plot', plotSettings);
			
			$("#previews").html("");
			$("#previews").css("display", "-webkit-flex");
			$("#previews").css("display", "flex");
			$("#previews").css("-webkit-align-items", "center");
			$("#previews").css("align-items", "center");
			$("#previews").css("-webkit-justify-content", "center");
			$("#previews").css("justify-content", "center");

			$("#previews").css("-webkit-flex-direction", "row");
			$("#previews").css("flex-direction", "row");
			$("#previews").css("-webkit-flex-wrap", "wrap");
			$("#previews").css("flex-wrap", "wrap");
			$("#previews").css("-webkit-flex-flow", "row wrap");
			$("#previews").css("flex-flow", "row wrap");
			$("#previews").css("-webkit-align-content", "flex-end");
			$("#previews").css("align-content", "flex-end");
			
			console.log(imageInfo);
			$.each(imageInfo, function(index, image) {
				if(image !== undefined &&
				  image.src !== undefined &&
				  image.src.url !== undefined &&
				  image.id !== undefined &&
				  image.name !== undefined){
					var d = $(document.createElement('div'));
					var i = $(document.createElement('img'));
					var a = $(document.createElement('a'));
					var artistPage = 'https://play.spotify.com/artist/' + image.id;
					d.css("margin", "20px");
					i.attr("id",image.id);
					i.addClass('cover');
					i.attr('src',image.src.url);
					i.attr('width','200px');
					a.text(image.name);
					a.attr('href',artistPage);
					a.css("text-decoration", "none");
					a.css("color", "white");
					a.css("display", "block");
					i.appendTo(d);
					a.appendTo(d);
					d.appendTo($("#previews"));
				}
			});
		});
	});
	$(document).on('click', '.cover',  function (e) {
		//restart audio or start playing audio on click
		if(audioObject !== undefined){
			audioObject.pause();	
		}
		
		var id = e.target.id;
		console.log(e.target);
		if(e.target.id === ""){
			id = e.target.parentElement.attributes.id;
		}
		console.log(e);
		console.log(e.target.id);
		let query = "https://api.spotify.com/v1/artists/" + e.target.id + "/top-tracks?country=US";
		$.getJSON(query,function(data){
			console.log(data.tracks[0].preview_url);
			audioObject = new Audio(data.tracks[0].preview_url);
			audioObject.play();
		});
		$(".playing").attr("class","cover"); 
		$("#" + e.target.id).attr("class","playing");
	});
	$(document).on('click', '.playing',  function (e) {
		if(audioObject !== undefined){
			audioObject.pause();	
		}
		console.log(e.target.id);
		$("#" + e.target.id).attr('class', 'cover');
	});
});
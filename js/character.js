$(document).ready(function(){
	var character = JSON.parse(localStorage.getItem("character"));
	console.log(character);

	$("h1").append(character['player_name'])
});
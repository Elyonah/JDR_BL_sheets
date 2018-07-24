$(document).ready(function(){
	var character = JSON.parse(localStorage.getItem("character"));
	console.log(character);

	/*var levels = getJsons('resources/level.json');*/
	/*console.log(levels);*/

	$("h1.character_name").append(character['character_name'])
	$("span.player_name").append(character['player_name'])

	var level = $(document.getElementById('level'));
	var xp = $(document.getElementById('xp'));
	var money = $(document.getElementById('money'));

	//character sheet
	$("#sheet .class").append(character['class']);
	$("#sheet .sexe").append(character['sex']);
	level.val(character['level']);
	xp_max.append(100);
	xp.val(character['xp']);
	money.val(character['money'])

	xp.change(function(){
		if($(this).val() >= parseInt(xp_max.text())){
			levelUp();
		}
	});


});

function levelUp(){
	$(level).val(parseInt($(level).val()) + 1)
	$(xp).val(0)
}

function CtrlMoney(type){
	var ctrlMoney = $("#CtrlMoney");
	if(type === 'add'){
		$(money).val(parseInt($(money).val()) + parseInt(ctrlMoney.val()))
	}else{
		var newAmount = parseInt($(money).val()) - parseInt(ctrlMoney.val());
		if(parseInt(newAmount) <= 0){
			$(money).val(0)
		}else{
			$(money).val(newAmount)
		}
	}
}

function openTab(evt, id) {
	    // Declare all variables
	    var i, tabcontent, tablinks;

	    // Get all elements with class="tabcontent" and hide them
	    tabcontent = document.getElementsByClassName("tabcontent");
	    for (i = 0; i < tabcontent.length; i++) {
	        tabcontent[i].style.display = "none";
	    }

	    // Get all elements with class="tablinks" and remove the class "active"
	    tablinks = document.getElementsByClassName("tablinks");
	    for (i = 0; i < tablinks.length; i++) {
	        tablinks[i].className = tablinks[i].className.replace(" active", "");
	    }

	    // Show the current tab, and add an "active" class to the button that opened the tab
	    document.getElementById(id).style.display = "block";
	    evt.currentTarget.className += " active";
	}

	function getJsons(url){
		$.getJSON( url, function( data ) {

		  var items = [];
		  $.each( data, function( key, val ) {
		    items.push(key, val);
		  });
		  return items;
		});
	}
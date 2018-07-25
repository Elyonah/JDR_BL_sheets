$(document).ready(function(){
	var character = JSON.parse(localStorage.getItem("character"));

	/*var levels = getJsons('resources/level.json');*/
	/*console.log(levels);*/

	$("h1.character_name").append(character['character_name'])
	$("span.player_name").append(character['player_name'])

	var level = document.getElementById('level');
	var xp = document.getElementById('xp');
	var money = document.getElementById('money');

	//character sheet
	$("#character_name").val(character['character_name']);
	$("#player_name").val(character['player_name']);
	$("#class").append(character['class']);
	$("#sexe").append(character['sex']);
	$("#current_level").append(character['level']);
	$("#current_xp").append(character['xp']);
	$("#max_xp").append('100');
	$("#current_shield").append(character['current_shield']);
	$("#max_shield").append(character['max_shield']);
	$("#current_health").append(character['current_health']);
	$("#max_health").append(character['max_health']);
	$(".money").append(character['money']);


	//inventory
	var inventory = [];
	var main_weapons = [];

	character['inventory'].forEach(function(weapon, id){
		if(weapon['eqquipped']){
			main_weapons.push(weapon);
		}else{
			inventory.push(weapon);
		}
	})

	inventory.forEach(function(item){
		//rangement des armes
		if(item['type'] === "weapon"){
			var listCntnr = $('.list-weapons');
			//TODO ajouter image selon type arme
	    	var li = $('<li>')
	        .addClass(item['rarity'])
	        .html(item['type'] + ' ' + item['brand'])
	        .appendTo(listCntnr);
    	}

    	//rangement des artefacts
    	if(item['type'] === "artefact"){
			var listCntnr = $('.list-artefacts');
			//TODO ajouter image grenade
	    	var li = $('<li>')
	        .addClass(item['rarity'])
	        .html(item['type'])
	        .appendTo(listCntnr);
    	}

    	//rangement des grenades
    	if(item['type'] === "mod_grenade"){
			var listCntnr = $('.list-grenads');
			//TODO ajouter image grenade
	    	var li = $('<li>')
	        .addClass(item['rarity'])
	        .html(item['type'] + ' ' + item['brand'])
	        .appendTo(listCntnr);
    	}

    	//rangement des modes de class
    	if(item['type'] === "mod_class"){
			var listCntnr = $('.list-mods');
			//TODO ajouter image grenade
	    	var li = $('<li>')
	        .addClass(item['rarity'])
	        .html(item['type'])
	        .appendTo(listCntnr);
    	}

    	//rangement des shields
    	if(item['type'] === "shield"){
			var listCntnr = $('.list-shields');
			//TODO ajouter image grenade
	    	var li = $('<li>')
	        .addClass(item['rarity'])
	        .html(item['type'])
	        .appendTo(listCntnr);
    	}
	})
});

function Controller(type, section){
	var controller = $("#main_controller");
	var value = parseInt(controller.val());

	var id_selected_section = '';
	var cntnr = '';
	var max = '';

	switch(section){
		case 'health' :
		selected_section = $("#current_health");
		cntnr = $("#current_health_cntnr");
		max = parseInt($("#max_health").html());
		break;
		case 'shield' :
		selected_section = $("#current_shield");
		cntnr = $("#current_shield_cntnr");
		max = parseInt($("#max_shield").html());
		break;
		case 'xp' :
		selected_section = $("#current_xp");
		max = parseInt($("#max_xp").html());
		cntnr = $("#xp_bar");
		break;
		case 'level':
		selected_section = $("#current_level");
		break;
		default:
		break;
	}

	if(type === "add"){
		var current_value = parseInt(selected_section.html()) + value;
		if(max !== ''){
			if(current_value >= max){
				if(section === 'xp'){
					selected_section.html("0");
					$("#current_level").html(parseInt($("#current_level").html()) + 1)
					$("#max_health").html(parseInt($("#max_health").html()) + 15)
				}else
					selected_section.html(max);
			}else{
				selected_section.html(current_value)
			}
		}else{
			if(section === 'level'){
				$("#current_xp").html("0");
				$("#max_health").html(parseInt($("#max_health").html()) + 15)
			}
			console.log(selected_section);
			console.log(current_value);
			selected_section.empty().html(current_value)
			$("body").removeClass('combat-survie');
		}
	}else{
		var current_value = parseInt(selected_section.html()) - value

		//Si on se prends un coup
		if(section === 'health'){
			//on prends la valeur restante du shield
			var shield_value = parseInt($("#current_shield").html())
			console.log('le bouclier a encore :', shield_value)
			//Si le shield est encore up
			if(shield_value !== 0){
				current_value = parseInt($("#current_shield").html() - value)
				console.log(current_value);
				console.log(current_value <= 0);
				//Si le shield tombe, on le met à zéro et on soustrait le reste à la barre de vie
				if(current_value <= 0){
					console.log('le shield tombe parce que la current value est supérieur à ma valeur de shield')
					$("#current_shield").empty().html("0")
					var rest = 0 - current_value;
					current_value = parseInt(selected_section.html()) - rest;
					console.log('rest: ', current_value)
				}
				else{
					console.log('le shield tiens le coup !')
					//Sinon on applique les dégâts au shield
					selected_section = $("#current_shield");
					cntnr = $("#current_shield_cntnr");					
				}
			}		
		}

		if(current_value >= 0){
			console.log('je nai plus que ', current_value)
			selected_section.html(current_value)
		} else {
			selected_section.empty().html("0")
			if(section === 'health')
				$("body").addClass('combat-survie');
		}
	}

	if (cntnr !== ''){
		//calcul de la nouvelle taille de la barre
	}
}

function CtrlMoney(type){
	var ctrlMoney = $("#main_controller");
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



	//TODO: Bouclier effet si vie max supp (début + équipement)
	//TODO drag & drop main weapons to inventory, etc :
	//https://openclassrooms.com/fr/courses/1916641-dynamisez-vos-sites-web-avec-javascript/1922434-le-drag-drop
var main_inventory = [];
var main_weapons = [];
var level = document.getElementById('level');
var xp = document.getElementById('xp');
var money = document.getElementById('money');

$(document).ready(function(){
	var character = JSON.parse(localStorage.getItem("character"));

	//header
	$("h1.character_name").append(character['character_name'])
	$("span.player_name").append(character['player_name'])

	//character sheet
	$("#character_name").val(character['character_name']);
	$("#player_name").val(character['player_name']);
	$("#class").append(character['class']);
	$("#gender").append(character['gender']);
	$("#current_level").append(character['level']);
	$("#current_xp").append(character['xp']);
	$("#max_xp").append('100');
	$("#current_shield").append(character['current_shield']);
	$("#max_shield").append(character['max_shield']);
	$("#current_health").append(character['current_health']);
	$("#max_health").append(character['max_health']);
	$(".money").append(character['money']);

	$('#current_slots').append(character['current_slots'])
	$('#max_slots').append(character['max_slots'])
	character['inventory'].forEach(function(weapon, id){
		if(weapon['eqquipped']){
			main_weapons.push(weapon);
		}else{
			main_inventory.push(weapon);
		}
	})
	$("button.sell").hide();

	refreshList();

	main_weapons.forEach(function(item, id){
		if(item['type'] === "weapon"){
			var cntnr = $('.weapon-section#'+item['slot']);

			cntnr.attr('data-list-id', id)
			//TODO ajouter image selon type arme
	    	$('<div>')
	        .addClass('item-name')
	        .addClass(item['rarity'])
	        .html(item['type'])
	        .appendTo(cntnr);

	        $('<div>')
	        .addClass('item-brand')
	        .html(item['brand'])
	        .appendTo(cntnr)
		}
	});

	//affichage d'un item dans la fenêtre dédiée
	$(".inventory-list li").click(function(){
		var cntnr = $(".window#current_inventory_weapon");
		var item = main_inventory[$(this).attr('id')];
		cleanWindow(cntnr);
		cntnr.attr("data-id", $(this).attr('id'));
		cntnr.children('.window-name').append(item['type'])
		cntnr.children('.window-content').append(item['rarity'])
		$("button.sell").show();
	})

	$(".weapon-section").click(function(){
		var cntnr = $(".window#current_primary_weapon");
		var item = main_weapons[$(this).attr('data-list-id')];
		cleanWindow(cntnr);
		cntnr.attr('data-id', $(this).attr('data-list-id'))
		cntnr.children('.window-name').append(item['type'])
		cntnr.children('.window-content').append(item['rarity'])
	});

});

function cleanWindow(cntnr){
	console.log("Clean Window");
	$(cntnr).children('.window-name').empty();
	$(cntnr).children('.window-content').empty();
}

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

function ControllerSale(){
	var sell;
    if (confirm("Voulez vous vraiment vendre cet item ? Attention, cette action est irréversible."))
        sell = true;
    else
        sell = false;

    if(sell){
    	var cntnr = $(".window#current_inventory_weapon");
    	var id_item = cntnr.attr('data-id');
    	main_inventory.splice(parseInt(id_item), 1);
    	cleanWindow(cntnr);
    	refreshList();
    }
}

function refreshList(){
	console.log("refreshList");
	//Clean list
	$('.list-weapons').empty();
	$('.list-artefacts').empty();
	$('.list-grenads').empty();
	$('.list-mods').empty();
	$('.list-shields').empty();

	//Repeuplage
	main_inventory.forEach(function(item, id){
		//rangement des armes
		if(item['type'] === "weapon"){
			var listCntnr = $('.list-weapons');
			//TODO ajouter image selon type arme
	    	$('<li>')
	    	.attr('id', id)
	        .addClass(item['rarity'])
	        .html(item['type'] + ' ' + item['brand'])
	        .appendTo(listCntnr);
    	}

    	//rangement des artefacts
    	if(item['type'] === "artefact"){
			var listCntnr = $('.list-artefacts');
			//TODO ajouter image grenade
	    	var li = $('<li>')
	    	.attr('id', id)
	        .addClass(item['rarity'])
	        .html(item['type'])
	        .appendTo(listCntnr);
    	}

    	//rangement des grenades
    	if(item['type'] === "mod_grenade"){
			var listCntnr = $('.list-grenads');
			//TODO ajouter image grenade
	    	var li = $('<li>')
	    	.attr('id', id)
	        .addClass(item['rarity'])
	        .html(item['type'] + ' ' + item['brand'])
	        .appendTo(listCntnr);
    	}

    	//rangement des modes de class
    	if(item['type'] === "mod_class"){
			var listCntnr = $('.list-mods');
			//TODO ajouter image grenade
	    	var li = $('<li>')
	    	.attr('id', id)
	        .addClass(item['rarity'])
	        .html(item['type'])
	        .appendTo(listCntnr);
    	}

    	//rangement des shields
    	if(item['type'] === "shield"){
			var listCntnr = $('.list-shields');
			//TODO ajouter image grenade
	    	var li = $('<li>')
	    	.attr('id', id)
	        .addClass(item['rarity'])
	        .html(item['type'])
	        .appendTo(listCntnr);
    	}
	})
	
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
var main_inventory = [];
var main_weapons = [];
var level = document.getElementById('level');
var xp = document.getElementById('xp');
var money = document.getElementById('money');
var character = null;

$(document).ready(function(){
	character_json = JSON.parse(localStorage.getItem("character"));
	character = new Character(character_json['player_name'], character_json['character_name'], character_json['class'], character_json['sex']);

	//If character imported
	character.setImportedCharacter(character_json['level'], character_json['xp'], character_json['current_shield'], character_json['max_shield'], character_json['current_health'], character_json['money']);


	console.log(character);


	displayHeader();
	displaySheet();
	/*displayInventory();
	displaySkills();*/

	//character sheet
	/*$('#current_slots').append(character_json['current_slots'])
	$('#max_slots').append(character_json['max_slots'])
	character_json['inventory'].forEach(function(weapon, id){
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
	});*/
});

function displayHeader(){
	$("h1.character_name").append(character.character_name)
	$("span.player_name").append(character.player_name)
}

function displaySheet(){
	$("#character_name").val(character.character_name);
	$("#player_name").val(character.player_name);
	$("#class").append(character.character_class);
	$("#gender").append(character.character_gender);
	$("#current_level").append(character.current_level);
	$("#current_xp").append(character.current_xp);
	$("#max_xp").append(character.calcMaxXP());
	$("#current_shield").append(character.current_shield);
	$("#max_shield").append(character.max_shield);
	$("#current_health").append(character.current_health);
	$("#max_health").append(character.calcMaxHealth());
	$(".money").append(character.money);
}

function displayInventory(){

}

function displaySkills(){
}

function TakeHit(){
	var value = parseInt($("#main_controller").val());

	if(!validate(value)){
		alert('Merci d\'entrer un nombre');
		return false;
	}

	character.takeHit(value);

    if(character.current_health === 0){
        $("body").addClass("combat-survie");
    }else{
        $("body").removeClass("combat-survie");
    }
	refresh("current_health", character.current_health);
	refresh("current_shield", character.current_shield);
	resetControllerInput();
}

function regenHealth(){
	var value = parseInt($("#main_controller").val());
	console.log(value)
	var regenMax = false;
	if(!validate(value)){
		if (confirm("Voulez-vous vraiment régénérer toute votre vie ?")){
			regenMax = true
		} else
			return false
		if(regenMax)
			character.regenHealth();			
	}else{
		if(character.current_health + value > character.max_health)
			character.regenHealth();
		else
			character.current_health += value;
		
	}

	refresh("current_health", character.current_health)
	resetControllerInput();

	
}

function regenShield(){
	var value = parseInt($("#main_controller").val());
	var regenMax = false;
	if(!validate(value)){
		if (confirm("Voulez-vous vraiment régénérer tout votre bouclier ?")){
			regenMax = true
		} else
			return false
		if(regenMax)
				character.regenShield();			
	}else{
		if(character.current_shield + value > character.max_shield)
			character.regenShield();
		else
			character.current_shield += value;
	}

	refresh("current_shield", character.current_shield)
	resetControllerInput();
}

function gainXP(){
    var value = parseInt($("#main_controller").val());
    if(!validate(value)){
    	alert('Merci d\'entrer un nombre');
        return false;
    }

    character.gainXP(value);

    refresh("current_xp", character.current_xp);
    refresh("max_xp", character.calcMaxXP());
    refresh("current_level", character.current_level);
    refresh("max_health", character.calcMaxHealth());
    resetControllerInput();
}

function correctXP(){
	var value = parseInt($("#main_controller").val());

	if(!validate(value)){
		alert('Merci d\'entrer un nombre');
		return false;
	}

	if(character.current_xp - value >= 0)
		character.current_xp -= value;
	else
		character.current_xp = 0;

	refresh("current_xp", character.current_xp);
	resetControllerInput();
}

function correctLevel(){
	var value = parseInt($("#main_controller").val());

	if(!validate(value)){
		alert('Merci d\'entrer un nombre');
		return false;
	}

	if(character.current_level - value >= 1)
		character.current_level -= value;
	else
		character.current_level = 1;
	resetControllerInput();
}

//Validation input dans Controller
function validate(value){
    if(isNaN(value)){
        return false;
    } else
    	return true;
}

function refresh(idCntnr, value){
	$("#"+idCntnr).empty().html(value);
}

function resetControllerInput(){
    $("#main_controller").val("");
}

/*Permet de clean les fenêtres d'aperçu des armes*/
function cleanWindow(cntnr){
	console.log("Clean Window");
	$(cntnr).children('.window-name').empty();
	$(cntnr).children('.window-content').empty();
}

/*Controller pour vente*/
function ControllerSale(){
	var sell;
	if (confirm("Voulez vous vraiment vendre cet item ? Attention, cette action est irréversible."))
		sell = true;
	else
		sell = false;

	if(sell){
		var price = Number(prompt("Veuillez entrer la valeur de revente", ""));
		console.log(price)
		console.log(price != null)
		console.log(isNaN(price))
		console.log(typeof price)
		if (price !== '' && ! isNaN(price)) {
			var cntnr = $(".window#current_inventory_weapon");
			var id_item = cntnr.attr('data-id');
			main_inventory.splice(parseInt(id_item), 1);
			cleanWindow(cntnr);
			refreshList();
		}else{
			alert('Merci d\'entrer une valeur numérique.')
		}
	}
}

/*Refresh list Inventaire*/
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

/*Old Money Cntrl*/
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

/*Tabber*/
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
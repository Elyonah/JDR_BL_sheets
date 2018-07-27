var main_inventory = [];
var main_weapons = [];
var level = document.getElementById('level');
var xp = document.getElementById('xp');
var money = document.getElementById('money');
var character = null;
var current_item_cntnr = null;

$(document).ready(function(){
	character_json = JSON.parse(localStorage.getItem("character"));
	character = new Character(
		character_json['player_name'], 
		character_json['character_name'], 
		character_json['class'], 
		character_json['gender']
		);

	//If character imported
	character.setImportedCharacter(
		character_json['level'], 
		character_json['xp'], 
		character_json['current_shield'], 
		character_json['max_shield'], 
		character_json['current_health'], 
		character_json['money']
		);

	character.inventory = new Inventory(character_json['max_slots'], character_json['enable_slots']);

	var weapons_list = [];
	var shields_list = [];
	var mods_list = [];
	var grenades_list = [];
	var coldWeapon = null;
	var coldSteel = null;

	character_json['inventory'].forEach(function(item, id){
		//Si c'est une arme
		if(item['type'] === itemType.WEAPON){
			var weapon = new Weapon(item['weapon_type'], item['brand'], item['rarity'],
				item['damages'], item['accuracy'], item['fire_rate'], item['reloading'],
				item['recoil'], item['max_ammo'], item['current_ammo'], item['elementary'],
				item['equipped'], item['slot'], item['critical_strike']);
			weapon.id = id
			weapons_list.push(weapon)
		}

		//Si c'est une arme (CAC)
		if(item['type'] === itemType.COLD_STEEL){
			coldSteel = new ColdSteel(item['description'], item['damages'])
		}
	});

	character.inventory['weapons'] = weapons_list;
	character.inventory['coldsteel'] = coldSteel;

	console.log(character);

	displayHeader();
	displaySheet();
	displaySlots();
	displayInventory();
	/*displaySkills();*/

    $(".item-controller").hide()

    $(".item.weapon").on('click', clickWeapon)
    $(".item-controller.slots").on('change', ControllerSlot)
});


function getItem(index){
	var selected_item = character.inventory['weapons'].find(function(element) {
        return element.id === index;
    });
	return selected_item;
}

function cleanActiveItem(){
    $(".item").each(function(item){
        $(this).removeClass('active');
    })
}

function cleanOptionSelect(){
    $(".item-controller.slots option").each(function(option, id){
        if(this.index > 0){
            this.remove();
        }
    })
}

function addOptionSelect(id, name){
	//clean all options
	var selectCntnr = $(".item-controller.slots")
	$("<option>")
		.attr("value", id)
		.html(name)
		.appendTo(selectCntnr)
}

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
	character['inventory']['weapons'].forEach(function(item, id){
		var cntnr = $('.list-weapons');	
		if(item['equipped']){
			cntnr = $('.weapon-section#main_slot_'+item['slot']);
            var weaponCntnr = $('<div>')
                .addClass('item')
                .addClass('weapon')
                .addClass(item['rarity'])
				.attr('id', item['id'])
                .appendTo(cntnr);

			$('<span>')
				.addClass('item-name')
                .html(item['weapon_type'])
				.appendTo(weaponCntnr)

            $('<span>')
                .addClass('item-brand')
                .html(item['brand'])
                .appendTo(weaponCntnr)
		}else{
            //TODO ajouter image selon type arme
            weaponCntnr = $('<li>')
				.attr('id', item['id'])
                .addClass('item')
                .addClass('weapon')
                .addClass(item['rarity'])
                .appendTo(cntnr);

            $('<span>')
                .addClass('item-name')
                .addClass(item['rarity'])
                .html(item['weapon_type'])
				.appendTo(weaponCntnr)
            $('<span>')
                .addClass('item-brand')
                .html(item['brand'])
                .appendTo(weaponCntnr)
		}
	})
}

function displaySlots(){
	var enable_slots = character.inventory['enable_weapons_slots']
	console.log('es: ', enable_slots)
	$('.main-weapons > .weapon-section').each(function(item, id){
		console.log(id);
	})
		var slots = $(".main-weapons").children();
		$(slots[i]).addClass('enable');

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

//Fonction de click sur un élément type Weapon
let clickWeapon = function(){
    current_item_cntnr = $(this);
    console.log(current_item_cntnr)
    if(current_item_cntnr.hasClass('active')){
        $(".item-controller").hide()
        current_item_cntnr.removeClass('active');
    }else{
        //On enlève l'actif aux autres items
        cleanActiveItem();
        //On ajoute l'actif à cet item
        current_item_cntnr.addClass('active');
        //On montre les contrôlleurs
        $(".item-controller").show()

        //On va chercher l'item dans l'inventaire
        var item = getItem(parseInt(current_item_cntnr.attr('id')));
        console.log(item)

        //Si l'élément est équipé, on peuple le select avec l'option (slot x sauf current) & inventaire
        cleanOptionSelect();
        if(item.equipped){
            addOptionSelect('inventory-list', 'Inventaire')
            for(var i=1; i<=character.inventory['enable_weapons_slots']; i++){
                if(i !== item.slot){
                    addOptionSelect('main_slot_'+i, 'Emplacement '+i)
                }
            }
        }else{
            for(var i=1; i<=character.inventory['enable_weapons_slots']; i++){
                addOptionSelect('main_slot_'+i, 'Emplacement '+i)
            }
        }
    }
};
//Fonction de déplacement d'un item
let ControllerSlot = function(){
    //On récupère l'item dans l'inventaire
    var active_item = getItem(parseInt($(".item.active").attr('id')))
    //On récupère la destination
    var destination = $("select.item-controller.slots").val();
    var slot = "slot";

    console.log(destination)
    //Si c'est un slot
    if(destination.indexOf(slot)){
        //On vérifie si le slot est vide.
        if($.trim( $('#'+destination).html()).length){
            //Si non, on déplace l'élément occupant dans l'inventaire, et on enlève son statut équipé
            var id_occupant = $("#"+destination+" .item").attr('id')
            var occupant = getItem(parseInt(id_occupant))

            occupant.equipped = false;
            delete occupant.slot
        }
        active_item.equipped = true;
        active_item.slot = parseInt(destination.substring(10, 11))
        $('.list-weapons').empty();
        $('.weapon-section').empty();
    }

    //On refresh l'affichage
	displayInventory();
    $(".item-controller").hide()

	//clean vars
    cleanActiveItem();
    current_item_cntnr = null;
}
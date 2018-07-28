var main_inventory = [];
var main_weapons = [];
var character = null;
var current_item_cntnr = null;
var dropPool = [];

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

	character_json['inventory'].forEach(function(item, id){
		//Si c'est une arme
		if(item['type'] === itemType.WEAPON){
			var weapon = new Weapon(item['weapon_type'], item['brand'], item['rarity'],
				item['damages'], item['accuracy'], item['fire_rate'], item['reloading'],
				item['recoil'], item['max_ammo'], item['current_ammo'], item['elementary'],
				item['equipped'], item['slot'], item['critical_strike']);
			weapon.id = id
            character.inventory['weapons'].push(weapon)
		}

		//Si c'est une arme (CAC)
		if(item['type'] === itemType.COLD_STEEL){
            character.inventory['coldsteel'] = new ColdSteel(item['description'], item['damages']);
		}
	});

	console.log(character);

	displayHeader();
	displaySheet();
	displaySlots();
	displayInventory();
	/*displaySkills();*/

    $(".item-controller").hide()
    $(".pool-controller").hide()
    $(".item-controller.slots").on('change', ControllerSlot)
	$("ul.drop-pool li").on('click', ControllerPool);
});

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
	$("#money").append(character.money);
}

function displayInventory(){
    $('.list-weapons').empty();
    $('.weapon-section').empty();
    refresh('current_slots', character.inventory.countAllInventoryItems())
    refresh("max_slots", character.inventory['max_inventory_slots'])

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

    $(".item.weapon").on('click', clickWeapon)
}

function displaySlots(){
	var enable_slots = parseInt(character.inventory['enable_weapons_slots'])
	$('.main-weapons > .weapon-section').each(function(id, item){
		$(item).removeClass('disabled')
		if(id >= enable_slots)
			$(item).addClass('disabled')
	})
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
var clickWeapon = function(){
    current_item_cntnr = $(this);
    current_item_cntnr.toggleClass('active')
	var active_items = $('#inventory .item.active').length

	//Affichage des controlleurs
    $(".item-controller").show()

	if(active_items === 1){
        //On va chercher l'item dans l'inventaire
        var item = character.inventory.getItem(parseInt(current_item_cntnr.attr('id')));

        //Peuplage dynamique du controller move
        cleanOptionSelect();
        if (item.equipped) {
            addOptionSelect('inventory-list', 'Inventaire')
            for (var i = 1; i <= character.inventory['enable_weapons_slots']; i++) {
                if (i !== item.slot) {
                    addOptionSelect('main_slot_' + i, 'Emplacement ' + i)
                }
            }
        } else {
            for (var i = 1; i <= character.inventory['enable_weapons_slots']; i++) {
                addOptionSelect('main_slot_' + i, 'Emplacement ' + i)
            }
        }
	} else if(active_items > 1){
    	$(".item-controller.slots").hide();
	} else {
        $(".item-controller").hide();
	}
};
//Fonction de déplacement d'un item
var ControllerSlot = function(){
	//TODO : Class mod
	//TODO : shield
	//TODO : grenad
    //On récupère l'item dans l'inventaire
    var active_item = character.inventory.getItem(parseInt($("#inventory .item.active").attr('id')))
    //On récupère la destination
    var destination = $("select.item-controller.slots").val();
    var slot = "main_slot_";

    //Si c'est un slot
    if(destination !== 'inventory-list'){
        //On vérifie si le slot est vide.
        if($.trim( $('#'+destination).html()).length){
            var id_occupant = $("#"+destination+" .item").attr('id')
            var occupant = character.inventory.getItem(parseInt(id_occupant))

			//Si l'active_item est déjà équipé, on échange les place
			if(active_item.equipped){
				var slot = occupant['slot'];
				occupant.slot = active_item.slot
				active_item.slot = slot;
			}else{
                //Sinon on déplace dans l'inventaire
                occupant.equipped = false;
                delete occupant.slot
			}
        }
        if(!active_item.equipped){
        	active_item.equipped = true;
        	active_item.slot = parseInt(destination.substring(10, 11))
		}else{
        	active_item.slot = parseInt(destination.substring(10, 11))
		}
    } else {
    	//Il s'agit de l'inventaire
		//On vérifie le nombre de slot disponible
		if(character.inventory.countAvailablesSlots() <= 0){
			alert('Vous n\'avez plus de place dans votre inventaire. Rendez-vous au distributeur le plus proche pour vendre des items ou jeter un item.')
		}else{
            active_item.equipped = false;
            delete active_item.slot
		}
	}

    //On refresh l'affichage
	displayInventory();
    $(".item-controller").hide()

	//clean vars
    cleanActiveItem();
    current_item_cntnr = null;
}

//Fonction de récupération d'un item
var ControllerPool = function(){
    current_item_cntnr = $(this);
    current_item_cntnr.toggleClass('active')

	if($('ul.drop-pool li.active').length > 0){
		$(".pool-controller.back").show();
	}else{
        $(".pool-controller.back").hide();
	}
}

function ControllerSale(){
    if(confirm('Êtes vous sûr de vouloir vendre cet(s) item(s) ? Attention, cette action est irréversible.')){
        $("#inventory .item.active").each(function(){
            var item = character.inventory.getItem(parseInt($(this).attr('id')))
            item.equipped = false;
            delete item.slot;

            var price = Number(prompt("Veuillez entrer la valeur de revente pour l'arme : " + item.weapon_type + ' ' + item.brand, ""));
            if (price !== '' && ! isNaN(price)) {
                character['money'] += price;
                item.value = price;
                dropPool.push(item);
                character.inventory['weapons'].forEach(function(element, id) {
                    if(item === element){
                        cleanActiveItem();
                        character.inventory['weapons'].splice(id, 1)
                    }
                });
            }else{
                alert('Merci d\'entrer une valeur numérique.')
            }
        })
        refresh('money', character['money'])
		displayPool();
        displayInventory();
    }
}

function ControllerDrop(){
    if(confirm('Êtes vous sûr de vouloir jeter cet(s) item(s) ? Attention, cette action est irréversible.')){
		$("#inventory .item.active").each(function(){
            var item = character.inventory.getItem(parseInt($(this).attr('id')))
			item.value = 0;
            item.equipped = false;
            delete item.slot;
            dropPool.push(item);
            character.inventory['weapons'].forEach(function(element, id) {
                if(item === element){
                    cleanActiveItem();
                    character.inventory['weapons'].splice(id, 1)
                }
            });
		})
	}
    displayPool();
	displayInventory();
}

function UnlockSlot(){
	if(character.inventory['enable_weapons_slots'] < character.inventory['max_weapons_slots']){
		character.inventory.unlockWeaponSlot();
        displaySlots();
	}
}

function UnlockInventorySlots(){
	character.inventory.unlockSlots();
    refresh("max_slots", character.inventory['max_inventory_slots'])
}

function displayPool(){
    $("ul.drop-pool").empty();
	if(dropPool.length > 0){
        $(".pool-controller.empty").show();
        dropPool.forEach(function(item, id){
            $('<li>')
                .addClass('item')
                .addClass(item['rarity'])
                .attr('id', item['id'])
                .html(item['weapon_type'] + ' ' + item['brand'])
                .appendTo($('ul.drop-pool'));
        })
        $("ul.drop-pool li").on('click', ControllerPool);
	}
	else{
        $(".pool-controller").hide();
	}
}

function cleanPool(){
	if(confirm("Êtes-vous sûr(e) de vouloir vider la pool ?")){
        $("ul.drop-pool").empty();
        $(".pool-controller").hide();
        dropPool = [];
	}
}

function getBackItem(){
	//On vérifie le nombre de place dans l'inventaire && on a assez d'argent
	var items = $("ul.drop-pool li.active");
	if(character.inventory.countAvailablesSlots() >= items.length){
       var total = 0
		items.each(function(id, item){
            var current_item = dropPool.filter(function(obj){
                return parseInt($(item).attr('id')) === obj['id']
            })
			total += parseInt(current_item[0].value);
		})
        if(parseInt(total) > character['money']){
        	alert("Vous n'avez pas assez d'argent pour récupérer tous ces items.")
		}else{
        	character['money'] = character['money'] - parseInt(total);
        	items.each(function(id, item){
        		var current_item = dropPool.filter(function(obj){
                    return parseInt($(item).attr('id')) === obj['id']
                })
				var the_item = current_item[0]
        		//On rajoute les items dans le stuff
				delete the_item.value;
				if(the_item.type === itemType.WEAPON){
                    character.inventory['weapons'].push(the_item)
				}

				refresh('money', character['money'])
                cleanActiveItem();
                dropPool.splice(id, 1);

				//On refresh l'inventaire
				displayInventory();
				displayPool();
			})
		}
	}else{
		alert("Vous n'avez pas assez de place dans votre inventaire pour récupérer tous ces items.")
	}

	//Si y'a assez de place que le nombre d'item selectionné, on les ajoute
	//On ajoute chaque item dans l'inventaire
	//On vérifie si l'item a été vendu, si oui, on repert l'argent

	//Sinon on ajoute un message
}

//TODO : Achat
//TODO : récupération depuis la pool
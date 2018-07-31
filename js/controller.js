var character = null;
var current_item_cntnr = null;
var current_weapon = null;
var dropPool = [];

$(document).ready(function () {
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
        character_json['current_health'],
        character_json['money']
    );

    character.inventory = new Inventory(character_json['max_slots'], character_json['enable_slots']);

    character_json['inventory'].forEach(function (item, id) {
        //ARME
        if (item['type'] === itemType.WEAPON) {
            var weapon = new Weapon(item['weapon_type'], item['brand'], item['rarity'],
                item['damages'], item['accuracy'], item['fire_rate'], item['reloading'],
                item['recoil'], item['max_ammo'], item['current_ammo'], item['elementary'],
                item['equipped'], item['slot'], item['critical_strike']);
            weapon.id = id
            if(item['equipped'] && item['actual'])
                weapon.actual = true
            character.inventory['weapons'].push(weapon)
        }

        //ARME AU CORPS-À-CORPS
        if (item['type'] === itemType.COLD_STEEL) {
            character.inventory['coldsteel'] = new ColdSteel(item['description'], item['damages']);
        }

        //BOUCLIER
        if (item['type'] === itemType.SHIELD) {
            var shield = new Shield(item['brand'], item['capacity'], item['rarity'], item['equipped'], item['reloading'], item['cooldown'], item['attributes'])
            shield.id = id;
            if (item['current_value']) {
                shield.current_value = item['current_value']
            }
            character.inventory['shields'].push(shield)
        }

        //GRENADE
        if (item['type'] === itemType.GRENADE) {
            var grenade = new Grenade(item['damages'], item['equipped'], item['rarity'], item['element'], item['transf'], item['grenade_type'], item['range'])
            grenade.id = id;
            character.inventory['grenades'].push(grenade)
        }

        //MOD DE CLASS
        if(item['type'] === itemType.MOD_CLASS) {
            var modclass = new modClass(item['class'], item['rarity'], item['equipped'], item['bonus'])
            modclass.id = id
            if(item['class'] !== character['class']){
                item.unusable = true
            }
            character.inventory['mods_class'].push(modclass)
        }
    });

    character.ammo = [];

    character_json['ammo'].forEach(function (item, id){
        var mun = new Ammo(item.type, item.value, item.capacity_max)
        character.ammo.push(mun)
    })

    console.log(character);

    displayHeader();
    displaySheet();
    displaySlots();
    displayInventory();
    displayAmmo();
    displayHUD();
    /*displaySkills();*/

    $(".item-controller").hide()
    $(".pool-controller").hide()
    $(".item-controller.slots").on('change', ControllerSlot)
    $("ul.drop-pool li").on('click', ControllerPool);
    $("#main-weapon").on('change', ControllerMainWeapon)
    //On check au début
    $("#main-weapon").trigger('change')
});

function cleanActiveItem() {
    printlog('cleanActiveItem')
    $(".item").each(function (item) {
        $(this).removeClass('active');
    })
}

function cleanOptionSelect() {
    printlog('cleanOptionSelect')
    $(".item-controller.slots option").each(function (option, id) {
        if (this.index > 0) {
            this.remove();
        }
    })
}

function addOptionSelect(id, name) {
    printlog('addOptionSelect')
    //clean all options
    var selectCntnr = $(".item-controller.slots")
    $("<option>")
        .attr("value", id)
        .html(name)
        .appendTo(selectCntnr)
}

function addWeaponOptionSelect(id, name, actual){
    printlog('addWeaponOptionSelect')
    //clean all options
    var selectCntnr = $("#main-weapon")
    var option = $('<option>')
        .attr("value", id)
        .html(name)

    if(actual)
        option.attr('selected', 'selected')

    option.appendTo(selectCntnr)
}

function resetControllerInput() {
    printlog('resetControllerInput')
    $("#main_controller").val("");
}

//Validation input dans Controller
function validate(value) {
    printlog('validate')
    if (isNaN(value)) {
        return false;
    } else
        return true;
}

/*Affichage*/
function displayHeader() {
    printlog('displayHeader')
    $("h1.character_name").append(character.character_name)
    $("span.player_name").append(character.player_name)
}

function displaySheet() {
    printlog('displaySheet')
    $("#character_name").val(character.character_name);
    $("#player_name").val(character.player_name);
    $("#class").html(character.character_class);
    $("#gender").html(character.character_gender);
    $("#current_level").html(character.current_level);
    $("#current_xp").html(character.current_xp);
    $("#max_xp").html(character.calcMaxXP());
    $("#current_shield").html(character.inventory.getCurrentShieldValue())
    $("#max_shield").html(character.inventory.getCurrentShieldMax());
    $("#current_health").html(character.current_health);
    $("#max_health").html(character.calcMaxHealth());
    $("#money").html(character.money);
}

function displayInventory() {
    printlog('displayInventory')

    //Suppression du contenu des listes
    $('.list-weapons, .list-shields, .list-grenades, .list-mods').empty();
    $('.weapon-section').empty();
    //Rafraîchissement des valeurs
    refresh('current_slots', character.inventory.countAllInventoryItems())
    refresh("max_slots", character.inventory['max_inventory_slots'])

    /*ARMES*/
    character['inventory']['weapons'].forEach(function (item, id) {
        var cntnr = $('.list-weapons');
        var cntnrType = '<li>'
        if (item['equipped']) {
            cntnr = $('.weapon-section#main_slot_' + item['slot']);
            cntnrType = '<div>'
        }

        //TODO ajouter image selon type arme
        var weaponCntnr = $(cntnrType)
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

    })
    $(".item.weapon").on('click', clickItem)

    /*BOUCLIERS*/
    character['inventory']['shields'].forEach(function (item, id) {
        var cntnr = $('.list-shields');
        var cntnrType = '<li>'
        if (item['equipped']) {
            cntnr = $('.weapon-section.shield-cntnr');
            cntnrType = '<div>'
        }

        //TODO: ajouter image shield
        var shieldCntnr = $(cntnrType)
            .addClass('item')
            .addClass('shield')
            .addClass(item['rarity'])
            .attr('id', item['id'])
            .appendTo(cntnr);

        $('<span>')
            .addClass('item-name')
            .html(item['type'])
            .appendTo(shieldCntnr)

        $('<span>')
            .addClass('item-brand')
            .html(item['brand'])
            .appendTo(shieldCntnr)
    })
    $(".item.shield").on('click', clickItem)

    /*GRENADES*/
    character['inventory']['grenades'].forEach(function (item, id) {
        var cntnr = $('.list-grenades');
        var cntnrType = '<li>';
        if (item['equipped']) {
            cntnr = $('.weapon-section.grenade-cntnr')
            cntnrType = '<div>';
        }
        //Ajouter image grenade
        var grenadeCntnr = $(cntnrType)
            .addClass('item')
            .addClass('grenade')
            .addClass(item['rarity'])
            .attr('id', item['id'])
            .appendTo(cntnr)
        $('<span>')
            .addClass('item-name')
            .html(item['type'])
            .appendTo(grenadeCntnr)
        $('<span>')
            .addClass('item-brand')
            .html(item['brand'])
            .appendTo(grenadeCntnr)
    })
    $(".item.grenade").on("click", clickItem)

    /*MOD DE CLASSE*/
    character['inventory']['mods_class'].forEach(function (item, id) {
        var cntnr = $('.list-mods');
        var cntnrType = '<li>';
        console.log(item)
        if (item['equipped']) {
            cntnr = $('.weapon-section.mod-class-cntnr')
            cntnrType = '<div>';
        }
        //Ajouter image grenade
        var modCntnr = $(cntnrType)
            .addClass('item')
            .addClass('mod_class')
            .addClass(item['rarity'])
            .attr('id', item['id'])
            .appendTo(cntnr)
        if(item['unusable']){
            modCntnr.addClass('unusable')
        }
        $('<span>')
            .addClass('item-name')
            .html("Mode de classe")
            .appendTo(modCntnr)
        $('<span>')
            .addClass('item-class')
            .html(item['class'])
            .appendTo(modCntnr)
    })
    $(".item.mod_class").on("click", clickItem)

    /*ARME AU CORPS-À-CORPS*/
    var cntnr = $('.weapon-section.cold-steel-cntnr')
    var cntnrType = '<div>'
    var CSCntnr = $(cntnrType)
        .addClass('item')
        .addClass('cold_steel')
        .appendTo(cntnr)
    $('<span>')
        .addClass('item-name')
        .html(character.inventory['coldsteel']['description'])
        .appendTo(CSCntnr)

    selectActualWeapon();
}

function displayAmmo(){
    printlog('displayAmmo')
    //clean values
    $("ul.ammo-list li span").html('');
    character.ammo.forEach(function(item, id){
        $("ul.ammo-list li#ammo-"+item.type +" span.current").append(item.value)
        $("ul.ammo-list li#ammo-"+item.type +" span.max").append(item.max)
    })
}

function displaySlots() {
    printlog('displaySlots')
    var enable_slots = parseInt(character.inventory['enable_weapons_slots'])
    $('.main-weapons > .weapon-section').each(function (id, item) {
        $(item).removeClass('disabled')
        if (id >= enable_slots)
            $(item).addClass('disabled')
    })
}

function displayPool() {
    printlog('displayPool')
    $("ul.drop-pool").empty();
    if (dropPool.length > 0) {
        $(".pool-controller.empty").show();
        dropPool.forEach(function (item, id) {
            var content = item['type']
            if (item.type === itemType.WEAPON) {
                content = item['weapon_type'] + ' ' + item['brand']
            }
            if (item.type === itemType.SHIELD){
                content = 'Bouclier ' + item['brand']
            }
            if (item.type === itemType.GRENADE){
                content = item['grenade_type'] + ' ' + item['brand']
            }
            if (item.type === itemType.MOD_CLASS){
                content = 'Mod de classe ' + item['class']
            }
            $('<li>')
                .addClass('item')
                .addClass(item['rarity'])
                .attr('id', item['id'])
                .html(content)
                .appendTo($('ul.drop-pool'));
        })
        $("ul.drop-pool li").on('click', ControllerPool);
    }
    else {
        $(".pool-controller").hide();
    }
}

function displayHUD(){
    var ammo_grenades = character.ammo.filter(function(item){
        return item.type === 'grenade'
    });

    var current = ammo_grenades[0].value
    var max = ammo_grenades[0].max
    $(".main-hud .hud-part.weapons .grenade-ammo .grenade").empty()

    for(var i = 1; i < max + 1; i++){
        var single_grenad =  $('<li>');
        if(i <= current){
            single_grenad.addClass('full')
        }else{
            single_grenad.addClass('empty')
        }

        //TODO: Icon grenade here
        $('<i>')
            .addClass('icon-plus')
            .appendTo(single_grenad)

        single_grenad.appendTo($(".main-hud .hud-part.weapons .grenade-ammo .grenade"))
    }
}

function selectActualWeapon(){
    $("#main-weapon option").each(function (option, id) {
        if (this.index > 0) {
            this.remove();
        }
    })
    var equipped = character.inventory.getEquippedWeapons();
    if(equipped.length !== 0){
        equipped.forEach(function(item){
            addWeaponOptionSelect('main_slot_'+item.slot, item.weapon_type + ' ' + item.brand, !!(item.actual))
        })
    }
}

function refresh(idCntnr, value) {
    printlog('refresh')
    $("#" + idCntnr).empty().html(value);
}

/*Permet de clean les fenêtres d'aperçu des armes*/
function cleanWindow(cntnr) {
    printlog('cleanWindow')
    $(cntnr).children('.window-name').empty();
    $(cntnr).children('.window-content').empty();
}

//Sheet functions
function TakeHit() {
    printlog('takeHit')
    var value = parseInt($("#main_controller").val());

    if (!validate(value)) {
        alert('Merci d\'entrer un nombre');
        return false;
    }

    character.takeHit(value);

    if (character.current_health === 0) {
        $("body").addClass("combat-survie");
    } else {
        $("body").removeClass("combat-survie");
    }
    refresh("current_health", character.current_health);
    refresh("current_shield", character.inventory.getCurrentShieldValue());
    resetControllerInput();
}

function regenHealth() {
    printlog('regenHealth')
    var value = parseInt($("#main_controller").val());
    var regenMax = false;
    if (!validate(value)) {
        if (confirm("Voulez-vous vraiment régénérer toute votre vie ?")) {
            regenMax = true
        } else
            return false
        if (regenMax)
            character.regenHealth();
    } else {
        if (character.current_health + value > character.max_health)
            character.regenHealth();
        else
            character.current_health += value;

    }

    refresh("current_health", character.current_health)
    resetControllerInput();
}

function BuyHealth(type){
    var value = 0;
    var price = 0;
    if(type === 'trousse'){
        value = 30;
        price = 20;
    }
    if(type === 'kit'){
        value = 15;
        price = 10;
    }
    if(!(character.money - price < 0)){
        if (character.current_health + value > character.max_health)
            character.regenHealth();
        else
            character.current_health += value;
        character.money -= price;
    }else{
        alert('Vous n\'avez pas assez d\'argent pour acheter ceci.')
    }

}

function regenShield() {
    printlog('regenShield')
    var value = parseInt($("#main_controller").val());
    var regenMax = false;
    if (!validate(value)) {
        if (confirm("Voulez-vous vraiment régénérer tout votre bouclier ?") || regenMax) {
            character.regenShield();
        }
    } else {
        if (character.inventory.getCurrentShieldValue() + value > character.inventory.getCurrentShieldMax())
            character.regenShield();
        else
            character.inventory.getShieldEquipped().current_value += value;
    }

    refresh("current_shield", character.inventory.getCurrentShieldValue())
    resetControllerInput();
}

function gainXP() {
    printlog('gainXP')
    var value = parseInt($("#main_controller").val());
    if (!validate(value)) {
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

function correctXP() {
    printlog('correctXP')
    var value = parseInt($("#main_controller").val());

    if (!validate(value)) {
        alert('Merci d\'entrer un nombre');
        return false;
    }

    if (character.current_xp - value >= 0)
        character.current_xp -= value;
    else
        character.current_xp = 0;

    refresh("current_xp", character.current_xp);
    resetControllerInput();
}

function correctLevel() {
    printlog('correctLevel')
    var value = parseInt($("#main_controller").val());

    if (!validate(value)) {
        alert('Merci d\'entrer un nombre');
        return false;
    }

    if (character.current_level - value >= 1)
        character.current_level -= value;
    else
        character.current_level = 1;
    resetControllerInput();
}

function Shoot(){
    printlog('Shoot')
}

/*Inventory functions*/

function UnlockSlot() {
    printlog('UnlockSlot')
    if (character.inventory['enable_weapons_slots'] < character.inventory['max_weapons_slots']) {
        character.inventory.unlockWeaponSlot();
        displaySlots();
    }
}

function UnlockInventorySlots() {
    printlog('UnlockInventorySlots')
    character.inventory.unlockSlots();
    refresh("max_slots", character.inventory['max_inventory_slots'])
}

/*Pool functions*/
function cleanPool() {
    printlog('cleanPool')
    if (confirm("Êtes-vous sûr(e) de vouloir vider la pool ?")) {
        $("ul.drop-pool").empty();
        $(".pool-controller").hide();
        dropPool = [];
    }
}

function getBackItem() {
    printlog('getBackItem')
    //On vérifie le nombre de place dans l'inventaire && on a assez d'argent
    var items = $("ul.drop-pool li.active");
    if (character.inventory.countAvailablesSlots() >= items.length) {
        var total = 0
        items.each(function (id, item) {
            var current_item = dropPool.filter(function (obj) {
                return parseInt($(item).attr('id')) === obj['id']
            })
            total += parseInt(current_item[0].value);
        })
        if (parseInt(total) > character['money']) {
            alert("Vous n'avez pas assez d'argent pour récupérer tous ces items.")
        } else {
            character['money'] = character['money'] - parseInt(total);
            items.each(function (id, item) {
                var current_item = getDropPoolItem(parseInt($(item).attr('id')));
                var current_item_id = getDropPoolItemID(current_item[0])
                //On rajoute les items dans le stuff
                delete current_item[0].value;
                if (current_item[0].type === itemType.WEAPON) {
                    character.inventory['weapons'].push(current_item[0])
                }
                if (current_item[0].type === itemType.SHIELD) {
                    character.inventory['shields'].push(current_item[0])
                }
                if (current_item[0].type === itemType.GRENADE) {
                    character.inventory['grenades'].push(current_item[0])
                }
                if (current_item[0].type === itemType.MOD_CLASS) {
                    character.inventory['mods_class'].push(current_item[0])
                }
                dropPool.splice(current_item_id, 1);
            })

            refresh('money', character['money'])
            cleanActiveItem();

            displayInventory();
            displayPool();
        }
    } else {
        alert("Vous n'avez pas assez de place dans votre inventaire pour récupérer tous ces items.")
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

//get DropPool item by item.id
function getDropPoolItem(custom_id) {
    printlog('getDropPoolItem')
    return dropPool.filter(function (obj) {
        return obj['id'] === custom_id
    })
}

//Get DropPool item id to erase
function getDropPoolItemID(item) {
    printlog('getDropPoolItemID')
    return dropPool.map(function (e) {
        return e.id
    }).indexOf(item['id'])
}

//Fonction de click sur un élément
var clickItem = function () {
    printlog('clickItem')
    current_item_cntnr = $(this);
    current_item_cntnr.toggleClass('active')
    var active_items = $('#inventory .item.active').length

    //Affichage des controlleurs
    $(".item-controller").show()

    if (active_items === 1) {
        //On va chercher l'item dans l'inventaire
        var item = character.inventory.getItem(parseInt(current_item_cntnr.attr('id')));
        //Peuplage dynamique du controller move
        cleanOptionSelect();
        if (item.equipped) {
            addOptionSelect('inventory-list', 'Inventaire')
            if (item.type === itemType.WEAPON) {
                for (var i = 1; i <= character.inventory['enable_weapons_slots']; i++) {
                    if (i !== item.slot) {
                        addOptionSelect('main_slot_' + i, 'Emplacement ' + i)
                    }
                }
            }
        } else {
            if (item.type === itemType.WEAPON) {
                for (var i = 1; i <= character.inventory['enable_weapons_slots']; i++) {
                    addOptionSelect('main_slot_' + i, 'Emplacement ' + i)
                }
            }
            if (item.type === itemType.SHIELD) {
                addOptionSelect('shield_slot', 'Emplacement de bouclier')
            }
            if (item.type === itemType.GRENADE) {
                addOptionSelect('grenade_slot', 'Emplacement de mode de grenade')
            }
            if (item.type === itemType.MOD_CLASS) {
                if(!item.unusable)
                    addOptionSelect('mod_slot', 'Emplacement de mode de classe')
            }
        }
    } else if (active_items > 1) {
        $(".item-controller.slots").hide();
    } else {
        $(".item-controller").hide();
    }
};

//Fonction de déplacement d'un item
var ControllerSlot = function () {
    printlog('ControllerSlot')
    //On récupère l'item dans l'inventaire
    var active_item = character.inventory.getItem(parseInt($("#inventory .item.active").attr('id')))
    //On récupère la destination
    var destination = $("select.item-controller.slots").val();

    //Si la destination est un slot
    if (destination !== 'inventory-list') {
        //Si le slot n'est pas vide
        if ($.trim($('#' + destination).html()).length) {
            var id_occupant = $("#" + destination + " .item").attr('id')
            var occupant = character.inventory.getItem(parseInt(id_occupant))
            //Si l'active_item est déjà équipé (uniquement pour weapon), on échange les places
            if (active_item.type === itemType.WEAPON && active_item.equipped) {
                var slot = occupant['slot'];
                occupant.slot = active_item.slot
                active_item.slot = slot;
            } else {
                //Sinon on déplace l'occupant dans l'inventaire
                occupant.equipped = false;
                if (active_item.type === itemType.WEAPON)
                    delete occupant.slot
                if (active_item.type === itemType.SHIELD)
                    delete occupant.current_value
            }
        }
        if (!active_item.equipped) {
            active_item.equipped = true;
            if (active_item.type === itemType.WEAPON)
                active_item.slot = parseInt(destination.substring(10, 11))
            if (active_item.type === itemType.SHIELD)
                active_item.current_value = active_item.capacity
        }
        if (active_item.equipped && active_item.type === itemType.WEAPON) {
            active_item.slot = parseInt(destination.substring(10, 11))
        }
    } else {
        //La destination est Inventaire
        //On vérifie le nombre de slot disponible
        if (character.inventory.countAvailablesSlots() <= 0) {
            alert('Vous n\'avez plus de place dans votre inventaire. Rendez-vous au distributeur le plus proche pour vendre des items ou jeter un item.')
        } else {
            active_item.equipped = false;
            if (active_item.type === itemType.WEAPON)
                delete active_item.slot
            if (active_item.type === itemType.SHIELD)
                delete active_item.current_value
        }
    }

    //On refresh l'affichage
    displaySheet(); //On refresh la fiche en cas de changement de shield
    displayInventory();
    displayHUD();
    $("#main-weapon").trigger('change')

    $(".item-controller").hide()

    //clean vars
    cleanActiveItem();
    current_item_cntnr = null;
}
//Fonction de récupération d'un item
var ControllerPool = function () {
    printlog('ControllerPool')
    current_item_cntnr = $(this);
    current_item_cntnr.toggleClass('active')

    if ($('ul.drop-pool li.active').length > 0) {
        $(".pool-controller.back").show();
    } else {
        $(".pool-controller.back").hide();
    }
}

var ControllerMainWeapon = function (){
    printlog('ControllerPool')
    character.inventory.getEquippedWeapons().forEach(function(item, id){
        if(item.actual)
            delete item.actual
    })

    var val = $(this).val();


    if(val !== 'none' && val !== 'Sélectionnez votre arme en main'){
        var id = $(this).val();
        var id_current = $("#"+id+" .item").attr('id')
        current_weapon = character.inventory.getItem(parseInt(id_current))
        current_weapon.actual = true

        console.log(current_weapon);
        $(".main-hud .hud-part.weapons .weapon-ammo img")
            .attr('src', 'images/'+current_weapon.weapon_type.replace('_', '-')+".png")

        $(".main-hud .hud-part.weapons .weapon-ammo span.value")
            .html(current_weapon.current_ammo)
        $(".main-hud .hud-part.weapons .weapon-ammo span.max")
            .html(current_weapon.max_ammo)
    }else{
        $(".main-hud .hud-part.weapons .weapon-ammo img")
            .attr('src', '')

        $(".main-hud .hud-part.weapons .weapon-ammo span.value")
            .html(0)
        $(".main-hud .hud-part.weapons .weapon-ammo span.max")
            .html(0)
    }

}


function ControllerSale() {
    printlog('ControllerSale')
    if (confirm('Êtes vous sûr de vouloir vendre cet(s) item(s) ? Attention, cette action est irréversible.')) {
        $("#inventory .item.active").each(function () {
            var item = character.inventory.getItem(parseInt($(this).attr('id')))
            item.equipped = false;
            var promptContent = '';
            if (item.type === itemType.WEAPON) {
                if(item.actual) {
                    delete item.actual
                }
                delete item.slot;
                promptContent = item['weapon_type'] + ' ' + item.brand
            }
            if (item.type === itemType.SHIELD){
                delete item.current_value
                promptContent = item['type'] + ' ' + item.brand
            }
            if (item.type === itemType.GRENADE){
                promptContent = item['grenade_type'] + ' ' + item.brand
            }
            if (item.type === itemType.MOD_CLASS){
                type = item['class']
                promptContent = 'Mode de classe ' + item['class']
            }


            var price = Number(prompt("Veuillez entrer la valeur de revente pour l'item : " + promptContent, ""));
            if (price !== '' && !isNaN(price) && price !== 0) {
                character['money'] += price;
                item.value = price;
                dropPool.push(item);
                character.inventory['weapons'].forEach(function (element, id) {
                    if (item === element) {
                        cleanActiveItem();
                        character.inventory['weapons'].splice(id, 1)
                    }
                });
                character.inventory['shields'].forEach(function (element, id) {
                    if (item === element) {
                        cleanActiveItem();
                        character.inventory['shields'].splice(id, 1)
                    }
                });
                character.inventory['grenades'].forEach(function (element, id) {
                    if (item === element) {
                        cleanActiveItem();
                        character.inventory['grenades'].splice(id, 1)
                    }
                });
                character.inventory['mods_class'].forEach(function (element, id){
                    if (item === element) {
                        cleanActiveItem();
                        character.inventory['mods_class'].splice(id, 1)
                    }
                })
            } else {
                alert('Merci d\'entrer une valeur numérique.')
            }
        })
        refresh('money', character['money'])
        displayPool();
        displayInventory();
        displayHUD();
        $("#main-weapon").trigger('change')
    }
}

function ControllerDrop() {
    printlog('ControllerDrop')
    if (confirm('Êtes vous sûr de vouloir jeter cet(s) item(s) ? Attention, cette action est irréversible.')) {
        $("#inventory .item.active").each(function () {
            var item = character.inventory.getItem(parseInt($(this).attr('id')))
            item.value = 0;
            item.equipped = false;
            if (item.type === itemType.WEAPON) {
                delete item.slot;
                if (item.actual) {
                    delete item.actual
                }
            }
            if (item.type === itemType.SHIELD)
                delete item.current_value
            dropPool.push(item);
            character.inventory['weapons'].forEach(function (element, id) {
                if (item === element) {
                    cleanActiveItem();
                    character.inventory['weapons'].splice(id, 1)
                }
            });
            character.inventory['shields'].forEach(function (element, id) {
                if (item === element) {
                    cleanActiveItem();
                    character.inventory['shields'].splice(id, 1)
                }
            });
            character.inventory['grenades'].forEach(function (element, id){
                if (item === element){
                    cleanActiveItem();
                    character.inventory['grenades'].splice(id, 1)
                }
            })
            character.inventory['mods_class'].forEach(function (element, id){
                if (item === element){
                    cleanActiveItem();
                    character.inventory['mods_class'].splice(id, 1)
                }
            })
        })
    }
    displaySheet();
    displayInventory();
    displayPool();
    displayHUD();
    $("#main-weapon").trigger('change')
}

//TODO : Achat
//TODO: Ammo & tir & rechargement
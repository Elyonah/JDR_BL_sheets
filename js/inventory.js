class Inventory{
	constructor(max_slots, enable_weapons){
		printlog('Inventory:: constructor');
		this.max_inventory_slots = max_slots
		this.enable_weapons_slots = enable_weapons
		this.max_weapons_slots = 4;
		this.weapons = [];
		this.shields = [];
		this.grenades = [];
		this.mods_class = [];
		this.coldsteel = null;
	}

	unlockSlots(){
		printlog('Inventory:: unlockSlots');
		this.max_inventory_slots += 4;
	}

	unlockWeaponSlot(){
		printlog('Inventory:: unlockWeaponSlot');
		if(this.enable_weapons_slots < this.max_weapons_slots){
			this.enable_weapons_slots += 1;
		}
	}

	countAllInventoryItems(){
		printlog('Inventory:: countAllInventoryItems')
		return this.countUnequippedItems()
	}

	countAvailablesSlots(){
		printlog('Inventory:: countAvailablesSlots')
		return this.max_inventory_slots - this.countUnequippedItems()
	}

	countUnequippedItems(){
		printlog('Inventory:: countUnequippedItems')
		var count = 0;
		var stuff = this.weapons.concat(this.shields, this.grenades, this.mods_class)
		stuff.forEach(function(item){
			if(!item.equipped){
				count += 1;
			}
		});
		return count;
	}

	getItem(index){
		printlog('Inventory:: getItem')
		var all_items = this.weapons.concat(this.shields, this.grenades, this.mods_class)
        var selected_item = all_items.find(function(element) {
            return element.id === index;
        });
        return selected_item;
	}

    getShieldEquipped(){
        printlog('Inventory:: getShieldEquipped')
        var shield = character.inventory['shields'].find(function(element) {
            return element.equipped === true;
        });
        return (shield === undefined) ? false : shield
    }

    getCurrentShieldMax(){
        printlog('Inventory:: getCurrentShieldMax')
        var shield = character.inventory['shields'].find(function(element) {
            return element.equipped === true;
        });
        return (shield === undefined) ? 0 : shield.capacity
	}

    getCurrentShieldValue(){
        printlog('Inventory:: getCurrentShieldValue')
        var shield = character.inventory['shields'].find(function(element) {
            return element.equipped === true;
        });
        return (shield === undefined) ? 0 : shield.current_value
	}

	getEquippedItems(){
		printlog('Inventory:: getEquippedItems')
		var equipped = [];
		var allStuff = this.weapons.concat(this.shields, this.grenades, this.mods_class)
		allStuff.forEach(function(item){
			if(element.equipped)
				equipped.push(item)
		})
		return equipped
	}

	getEquippedWeapons(){
		printlog('Inventory:: getEquippedWeapons')
		var equipped = [];
		this.weapons.forEach(function(item){
			if(item.equipped)
				equipped.push(item)
		})
		return equipped
	}
}
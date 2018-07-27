class Inventory{
	constructor(max_slots, enable_weapons){
		printlog('Inventory:: constructor');
		this.max_inventory_slots = max_slots
		this.enable_weapons_slots = enable_weapons
		this.max_weapons_slots = 4;
		this.weapons = [];
		this.shields = [];
		this.grenads = [];
		this.class_mods = [];
		this.coldSteel = null;
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

	countAvailablesSlots(){
		printlog('Inventory:: countAvailablesSlots')
		return this.max_inventory_slots - this.countUnequippedWeapons()
	}

	countUnequippedWeapons(){
		printlog('Inventory:: countUnequippedWeapons')
		var count = 0;
		this.weapons.forEach(function(item){
			if(!item.equipped){
				count += 1;
			}
		});
		return count;
	}
}
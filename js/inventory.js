class Inventory{
	constructor(max_slots, enable_weapons){
		printlog('Inventory:: constructor');
		this.max_inventory_slots = max_slots
		this.enable_weapons_slots = enable_weapons
	}

	unlockSlots(){
		printlog('Inventory:: unlockSlots');
		this.max_inventory_slots += 4;
	}

	unlockWeaponSlot(){
		printlog('Inventory:: unlockWeaponSlot');
		this.enable_weapons_slots += 1;
	}
}
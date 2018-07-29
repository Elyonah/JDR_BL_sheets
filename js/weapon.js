class Weapon extends Item{
	constructor(weapon_type, brand, rarity, dmg, accuracy, fire_rate, reloading, 
		recoil, max_ammo, current_ammo, elementary, equipped, slot, critical_strike){
        super();
		this.type = itemType.WEAPON
		this.weapon_type = weapon_type
		this.brand = brand
		this.rarity = rarity
		this.damages = dmg
		this.accuracy = accuracy
		this.fire_rate  = fire_rate 
		this.reloading = reloading
		this.recoil = recoil
		this.max_ammo = max_ammo
		this.current_ammo = current_ammo
		this.elementary = elementary
		this.equipped = equipped
		this.slot = slot
		this.critical_strike = critical_strike
	}

	Shoot(){
		this.ammo -= 1;
	}

	Reload(){
		this.ammo = this.max_ammo 
	}
}
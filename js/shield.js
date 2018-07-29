class Shield extends Item{
    constructor(brand, capacity, rarity, equipped, reloading, cooldown, attributes){
        super();
        this.type = itemType.SHIELD
        this.brand = brand
        this.rarity = rarity
        this.capacity = capacity
        this.equipped = equipped
        this.reloading = reloading
        this.cooldown = cooldown
        this.attributes = attributes
    }
}
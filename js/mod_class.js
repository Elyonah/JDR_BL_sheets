class modClass extends Item{
    constructor(_class, rarity, equipped, bonus){
        super()
        this.type = itemType.MOD_CLASS
        this.class = _class
        this.rarity = rarity
        this.equipped = equipped
        this.bonus = bonus
    }
}
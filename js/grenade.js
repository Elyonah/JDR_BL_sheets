class Grenade extends Item{
    constructor(dmg, equipped, rarity, element, transf, type, range){
        super()
        this.type = itemType.GRENADE
        this.damages = dmg
        this.equipped = equipped
        this.rarity = rarity
        this.element = element
        this.range = range
        this.transf = transf
        if(this.transf) {
            this.grenade_type = grenadeTypes.NORMAL
            this.brand = SBrands.ANSHIN
        }else{
            this.grenade_type = type
            switch(this.grenade_type){
                case grenadeTypes.LONGBOW:
                    this.brand = WBrands.HYPERION
                    break
                case grenadeTypes.PROXI:
                    this.brand = WBrands.VLADOF
                    break
                case grenadeTypes.MIRV:
                    this.brand = WBrands.TORGUE
                    break
                default:
                    this.brand = WBrands.TEDIORE
                    break
            }
        }
    }
}

/*
Degats
Element: explosive (base)
transfu: false (soit element soit transfu) ANSHIN
type : normal / longbow (HYPERION) / proxi(VLADOF) / MIRV (TORGUE)
Taille explosion: (m)
*/
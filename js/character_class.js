class Character{
    constructor(player_name, character_name, character_class, character_gender){
        printlog('Character:: constructor');
        this.character_name = character_name;
        this.player_name = player_name;
        this.character_class = character_class;
        this.character_gender = character_gender;
        this.current_level = 1;
        this.current_xp = 0;
        this.current_shield = 0;
        this.max_shield = 0;
        this.current_health = 0;
        this.max_health = 0;
        this.money = 80;
    }

    /*Methods*/
    setImportedCharacter(lvl, xp, shield, max_shield, health, money){
        printlog('Character:: SetImportedCharacter');
        this.current_level = lvl;
        this.current_xp = xp;
        this.current_shield = shield;
        this.max_shield = max_shield;
        this.current_health = health ;
        this.max_health = this.calcMaxHealth();
        this.money = money;
    }
    calcMaxHealth(){
        return 100 + (15 * (this.current_level - 1));
    }
    calcMaxXP(){
        return Math.round(100 * Math.pow(2.5, (this.current_level - 1)))
    }
    levelUp(){
        printlog("Character:: levelUp")
        this.max_health = this.level + 15;
        this.max_xp = this.calcMaxXP();
        this.current_xp = 0;
        this.current_level += 1;
        this.current_health = this.max_health;
        this.current_shield = this.max_shield;
    }
    regenHealth(){
        this.current_health = this.max_health;
    }
    regenShield(){
        this.current_shield = this.max_shield;
    }
    takeHit(dmg){
        printlog("Character:: takeHit");
        if(this.current_shield > 0){
            var newValue = this.current_shield - dmg;
            this.current_shield = newValue;
            if(newValue <= 0){
                this.current_shield = 0;
                var rest = 0 - newValue;
                this.current_health -= rest;
            }
        }else{
            if(this.current_health - dmg > 0)
                this.current_health -= dmg;
            else
                this.current_health = 0;
        }
    }
    gainXP(xp){
        printlog("Character:: gainXP")
        this.current_xp += xp;
        if(this.current_xp >= this.calcMaxXP()){
            var rest = this.current_xp - this.calcMaxXP();
            this.levelUp();
            if (rest !== 0)
                this.current_xp += rest;
        }
    }
    toJson(){
        printlog('Character:: toJson');
        var character_array = [];
        character_array["player_name"] = this.player_name;
        character_array["character_name"] = this.character_name;
        character_array["class"] = this.character_class;
        character_array["gender"] = this.character_gender;
        character_array["level"] = this.current_level;
        character_array["xp"] = this.current_xp;
        character_array["money"] = this.money;
        character_array["current_health"] = this.current_health;
        character_array["current_shield"] = this.current_shield;
        character_array["max_shield"] = this.max_shield;
        return JSON.stringify(character_array)
    }
}
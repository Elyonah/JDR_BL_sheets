import {Inventory} from "./inventory";

export class Character{
    current_level = 1
    current_xp = 0
    current_shield = 0
    max_shield = 0
    current_health = 0
    max_health = 0
    money = 80

    constructor(player_name, character_name, character_class, character_gender){
        this.character_name = character_name;
        this.player_name = player_name;
        this.character_class = character_class;
        this.character_gender = character_gender;
        this.inventory = new Inventory();
    }

    set currentLevel(currentLvl){
        this.current_level =  currentLvl
    }
    get currentLevelt(){
        return this.current_level;
    }
    set currentXP(currentXP){
        this.current_xp =  currentXP
    }
    get currentXP(){
        return this.current_xp;
    }
    set currentHealth(newhealth){
        this.current_health = newhealth;
    }
    get currentHealth(){
        return this.current_health;
    }
    set currentMoney(newAmount){
        this.money = newAmount;
    }
    get currentMoney(){
        return this.money;
    }

    levelUp(){
        this.max_health = this.level + 15;
    }
}
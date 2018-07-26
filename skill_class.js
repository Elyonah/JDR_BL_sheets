class Skill{
    constructor(skill_name, skill_description, skill_point){
        console.log('Skill:: constructor');
        this.skill_name = skill_name;
        this.skill_description = skill_description;
        this.skill_point = skill_point;
    }

    /*Getters & setters*/

    set skillName(newName){
        this.skill_name = newName;
    }
    get skillName(){
        return this.character_name;
    }

    set skillDescription(newName){
        this.skill_description = newName;
    }
    get skillDescription(){
        return this.character_name;
    }

    set skillPoint(newName){
        this.skill_point = newName;
    }
    get skillPoint(){
        return this.character_name;
    }


    toJson(){
        var skill_array = [];
        skill_array["skill_name"] = this.skill_name;
        skill_array["skill_description"] = this.skill_description;
        skill_array["skill_point"] = this.skill_point;
        return JSON.stringify(skill_array)
    }
}
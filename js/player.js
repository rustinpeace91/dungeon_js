// test stats
const player = { 
    alive: true, 
    level: 1,
    HP: 20, 
    weapon: {
        name: "longsword",
        type: "slashing",
        weight: 5,
        toAttack: 0,
        range: 1,
        damage: function() {
            return Dice.throwD8()
        }
    },
    takeHit: function(damage){
        this.HP -= damage;
        if(this.HP <= 0){
            this.alive = false;
            console.log(this.name + " has died");
        }
    }
}
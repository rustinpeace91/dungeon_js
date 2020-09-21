// The Dice object. handles all the dice rolling needed for the D20 System. Returns random rolls between numbers
// also has a multiroll method, for rolling multiple dice. 


var Dice = {
    throwD4: function () {
        var randomNumber = Math.random();
        var improvedNum = (randomNumber * 4) + 1;
        var final = Math.floor(improvedNum);
        return final;
    },

    throwD6: function() {
        var randomNumber = Math.random();
        var improvedNum = (randomNumber * 6) + 1;
        var final = Math.floor(improvedNum);
        return final;
    },

    throwD8: function(){
        var randomNumber = Math.random();
        var improvedNum = (randomNumber * 8) + 1;
        var final = Math.floor(improvedNum);
        return final;
    },

    throwD12: function(){
        var randomNumber = Math.random();
        var improvedNum = (randomNumber * 12) + 1;
        var final = Math.floor(improvedNum);
        return final;
    },

    throwD10: function() {
        var randomNumber = Math.random();
        var improvedNum = (randomNumber * 10) + 1;
        var final = Math.floor(improvedNum);
        return final;
    },

    throwD20: function() {
        var randomNumber = Math.random();
        var improvedNum = (randomNumber * 20) + 1;
        var final = Math.floor(improvedNum);
        return final;
    },
    multiroll(dieType, quantity) {
        var total = 0;
        for(i = 0; i < quantity; i++){
            total += dice[dieType]();
        }
        return total;
    }
};



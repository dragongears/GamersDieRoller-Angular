(function () {

    'use strict';

    function DiceService() {
        return {
            die: 6,
            multiplier: 1,
            modifier: 0,
            result: 1,
            name: "",

            type: [2, 3, 4, 6, 8, 10, 12, 16, 20, 30, 100],
            mult: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            mod: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 0],

            roll: function () {
                this.result = 0;
                for (var x = 0; x < this.multiplier; x++) {
                    this.result += Math.floor(Math.random() * this.die) + 1;
                }
                this.result += this.modifier;
                return this.result;
            },

            modifierStr: function () {
                if (this.modifier < 0) {
                    return this.modifier;
                } else {
                    return '+' + this.modifier;
                }
            },

            toString: function () {
                return this.multiplier + 'd' + this.die + this.modifierStr();
            }
        };
    }

    angular
        .module('dice')
        .service('DiceService', DiceService);

})();

/*jslint node:true, mocha:true */

'use strict';

var angular = require('angular');
var assert = require('chai').assert;
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});


describe('Dice', function () {
    // define variables for the services we want to access in tests
    var Dice;

    beforeEach(function () {
        // load the module we want to test
        angular.module('roller');

        // inject the services we want to test
        angular.inject(function (_Dice_) {
            Dice = _Dice_;
        });
    });

    describe('#DoSomething', function () {
        it('should log the message "something done!"', function () {
            // Arrange

            // Act
            Dice.roll();

            // Assert
            assert(Dice.die.equals(6));

            // Cleanup
        });
    });
});

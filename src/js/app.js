'use strict';

// Declare app level module which depends on views, and components
var roller = angular.module('roller', ['core']);

roller.component('diePanel', {
    templateUrl: 'templates/die-panel.html',
    controller: ['$scope', 'DiceService', function DiePanelController($scope, DiceService) {

        $scope.dice = DiceService;
        $scope.result = 'Roll';

        $scope.doRoll = function() {
            $scope.result = $scope.dice.roll();
        };

        $scope.doType = function() {
            $("#diceModal").modal({backdrop: "static", keyboard: "false", show: "true"});
        };

        $scope.doMult = function() {
            $("#multModal").modal({backdrop: "static", keyboard: "false", show: "true"});
        };

        $scope.doMod = function() {
            $("#modModal").modal({backdrop: "static", keyboard: "false", show: "true"});
            if ($scope.dice.modifier >= 0) {
                $('#optionPos').button('toggle');
            }
            else {
                $('#optionNeg').button('toggle');
            }
        };
    }]
});

roller.component('typeDialog', {
    templateUrl: 'templates/type-dialog.html',
    controller: ['$scope', 'DiceService', function TypeDialogController($scope, DiceService) {
        $scope.dice = DiceService;

        $scope.doChangeType = function(newType) {
            $scope.dice.die = newType;
            $("#diceModal").modal('hide');
        };
    }]
});

roller.component('multiplierDialog', {
    templateUrl: 'templates/multiplier-dialog.html',
    controller: ['$scope', 'DiceService', function MultiplierDialogController($scope, DiceService) {
        $scope.dice = DiceService;

        $scope.doChangeMult = function(newMult) {
            $scope.dice.multiplier = newMult;
            $("#multModal").modal('hide');
        };
    }]
});

roller.component('modifierDialog', {
    templateUrl: 'templates/modifier-dialog.html',
    controller: ['$scope', 'DiceService', function ModifierDialogController($scope, DiceService) {
        $scope.dice = DiceService;

        $scope.doChangeMod = function(newMod) {
            $scope.dice.modifier = newMod * ($('#optionPos').hasClass('active') ? 1 : -1);
            $("#modModal").modal('hide');
        };
    }]
});

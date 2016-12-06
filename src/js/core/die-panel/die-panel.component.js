(function () {

    'use strict';

    angular
        .module('roller')
        .component('diePanel', {
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

})();

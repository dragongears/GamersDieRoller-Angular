(function () {

    'use strict';

    angular
        .module('roller')
        .component('multiplierDialog', {
            templateUrl: 'templates/multiplier-dialog.html',
            controller: ['$scope', 'DiceService', function MultiplierDialogController($scope, DiceService) {
                $scope.dice = DiceService;

                $scope.doChangeMult = function(newMult) {
                    $scope.dice.multiplier = newMult;
                    $("#multModal").modal('hide');
                };
            }]
        });

})();

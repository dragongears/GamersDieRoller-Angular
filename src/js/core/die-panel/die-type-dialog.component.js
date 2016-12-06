(function () {

    'use strict';

    angular
        .module('roller')
        .component('dieTypeDialog', {
            templateUrl: 'templates/die-type-dialog.html',
            controller: ['$scope', 'DiceService', function TypeDialogController($scope, DiceService) {
                $scope.dice = DiceService;

                $scope.doChangeType = function(newType) {
                    $scope.dice.die = newType;
                    $("#diceModal").modal('hide');
                };
            }]
        });

})();

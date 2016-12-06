(function () {

    'use strict';

    angular
        .module('roller')
        .component('modifierDialog', {
            templateUrl: 'templates/modifier-dialog.html',
            controller: ['$scope', 'DiceService', function ModifierDialogController($scope, DiceService) {
                $scope.dice = DiceService;

                $scope.doChangeMod = function(newMod) {
                    $scope.dice.modifier = newMod * ($('#optionPos').hasClass('active') ? 1 : -1);
                    $("#modModal").modal('hide');
                };
            }]
        });

})();

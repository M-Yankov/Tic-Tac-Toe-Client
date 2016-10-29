/* globals angular*/
(function () {
    'use strict';

    function UsersGamesController(gameManager, notifier) {

        var vm = this;
        vm.isLoaded = false;

        getAllGames();

        vm.userGames = true;
        vm.getAllGames = getAllGames;

        function getAllGames(state, gameName, playerName, count, order) {
            vm.isLoaded = false;
            gameManager.getPrivateGames(state, gameName, playerName, count, order)
                .then(function (games) {
                    vm.allGames = games;
                    vm.isLoaded = true;
                }, function (errorResponse) {
                    var errors = {};
                    vm.isLoaded = true;

                    notifier.error(errorResponse.data.Message, 'Error');

                    if (errorResponse.data && errorResponse.data.ModelState[""]) {
                        errors = errorResponse.data.ModelState[""];

                        for (var ind in errors) {
                            if (errors.hasOwnProperty(ind)) {
                                notifier.error(errors[ind], errorResponse.statusText);
                            }
                        }
                    }
                });
        }
    }

    angular.module('tttGame.controllers')
        .controller('UsersGamesController', ['gameManager', 'notifier', UsersGamesController]);
}());
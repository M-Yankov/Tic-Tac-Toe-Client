/* globals angular*/
(function () {
    'use strict';

    function AllGamesController(gameManager, notifier) {
        var vm = this;
        vm.isLoaded = false;

        getAllGames();

        function getAllGames() {
            gameManager.allGames()
                .then(function (games) {
                    vm.allGames = games;
                    vm.isLoaded = true;
                }, function (errorResponse) {
                    console.error(errorResponse);
                    var errors = {};
                    notifier.error(errorResponse.data.Message, 'Error');

                    vm.isLoaded = true;
                    if (errorResponse.data && errorResponse.data.ModelState && errorResponse.data.ModelState[""]) {
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
        .controller('AllGamesController', ['gameManager', 'notifier', AllGamesController]);
}());
/*globals angular*/
(function () {
    'use strict';

    function GameService(dataService, $q) {

        function createGame(game) {
            return dataService.postRequest('api/games/create', game);
        }

        function joinGame(id, password) {
            password = password || '';
            return dataService.postRequest('api/games/join?id=' + id, { 'password' : password});
        }

        function details(id) {
            return dataService.getRequest('api/games/status?gameId=' + id);
        }

        function play(tileRequest) {
            return dataService.postRequest('api/games/play', tileRequest);
        }

        function allGames() {
            var deferred = $q.defer();

            dataService.getRequest('api/games/all')
                .then(function (allGames) {
                    deferred.resolve(allGames);
                }, function (error) {
                    deferred.reject(error);
                });


            return deferred.promise;
        }

        function getPrivateGames() {
            return dataService.getRequest('api/games/PrivateGames');
        }

        return {
            createGame: createGame,
            joinGame: joinGame,
            gameDetails: details,
            play: play,
            allGames: allGames,
            getPrivateGames: getPrivateGames
        };
    }

    angular.module('tttGame.services')
        .factory('gameManager', ['dataService', '$q', GameService]);
}());
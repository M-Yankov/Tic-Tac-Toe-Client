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

        function details(id, isForJoin) {
            var url = 'api/games/status?gameId=' + id + '&isForJoin=' + !!isForJoin;
            return dataService.getRequest(url);
        }

        function play(tileRequest) {
            return dataService.postRequest('api/games/play', tileRequest);
        }

        function allGames(state, gameName, playerName, count, order) {
            var deferred = $q.defer();

            var query = {
                state: state,
                gameName: gameName,
                playerName: playerName,
                count: count,
                order: order
            };

            var url = 'api/games/all/';

            dataService.getRequest(url, query)
                .then(function (allGames) {
                    deferred.resolve(allGames);
                }, function (error) {
                    deferred.reject(error);
                });


            return deferred.promise;
        }

        function getPrivateGames(state, gameName, playerName, count, order) {

            var query = {
                state: state,
                gameName: gameName,
                playerName: playerName,
                count: count,
                order: order
            };

            return dataService.getRequest('api/games/PrivateGames/', query);
        }

        function setQueryParameter(parameterValue, parameterName, url) {
            var parameter = !!parameterValue ?  parameterName + '=' + parameterValue : '';
            if (url[ url.length - 1] !== '?') {
                parameter = '&' + parameter;
            }

            return parameter;
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
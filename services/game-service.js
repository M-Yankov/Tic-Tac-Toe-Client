/*globals angular*/
(function () {
    'use strict';

    // TODO refactor this later
    function GameService(dataService, $q) {
        var cachedGames;

        function createGame() {

            return dataService.postRequest('api/games/create');
            /*
             var deferred = $q.defer();

             $http.post(domain + 'api/games/create')
             .then(function (successResponse) {
             deferred.resolve(successResponse);
             }, function (errorResponse) {
             deferred.reject(errorResponse);
             });

             return deferred.promise;*/
        }

        function joinGame() {

            return dataService.postRequest('api/games/join');

            /*var deferred = $q.defer();

             $http.post(domain + 'api/games/join')
             .then(function (successResponse) {
             deferred.resolve(successResponse);
             }, function (errorResponse) {
             deferred.reject(errorResponse);
             });

             return deferred.promise;*/
        }

        function details(id) {

            return dataService.getRequest('api/games/status?gameId=' + id);
            /*var deferred = $q.defer();

             $http.get(domain + 'api/games/status?gameId=' + id)
             .then(function (successResponse) {
             deferred.resolve(successResponse);
             }, function (errorResponse) {
             deferred.reject(errorResponse);
             });

             return deferred.promise;*/
        }

        function play(tileRequest) {

            return dataService.postRequest('api/games/play', tileRequest);
            /*
             var deferred = $q.defer();

             $http.post(domain + 'api/games/play', tileRequest)
             .then(function (successResponse) {
             deferred.resolve(successResponse);
             }, function (errorResponse) {

             deferred.reject(errorResponse);
             });

             return deferred.promise;*/
        }

        function allGames() {
            var deferred = $q.defer();
            if (!!cachedGames) {
                deferred.resolve(cachedGames);
                return deferred.promise;
            } else {
                dataService.getRequest('api/games/all')
                    .then(function (allGames) {
                        cachedGames = allGames;
                        deferred.resolve(allGames);
                    }, function (error) {
                        deferred.reject(error);
                    });
            }

            return deferred.promise;
            /*var deferred = $q.defer();

             $http.get(domain + 'api/games/all')
             .then(function (successResponse) {
             deferred.resolve(successResponse);
             }, function (errorResponse) {
             deferred.reject(errorResponse);
             });

             return deferred.promise;*/
        }

        function getPrivateGames() {
            return dataService.getRequest('api/games/PrivateGames');
            /*
             var deferred = $q.defer();

             $http.get(domain + 'api/games/PrivateGames')
             .then(function (successResponse) {
             deferred.resolve(successResponse);
             }, function (errorResponse) {
             deferred.reject(errorResponse);
             });

             return deferred.promise;*/
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
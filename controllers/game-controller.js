/* globals angular, hm, $*/
(function () {
    'use strict';

    function GameController($location, $routeParams, $interval, notifier, gameManager, $scope, identity) {
        var vm = this;

        var promiseToDestroy;
        vm.tile = {};
        vm.isGameCreating = false;
        vm.isInGameJoiningProcess = false;
        vm.isLoaded = false;
        vm.joinGameDetails = {};

        // join route also has id
        var isJoinUrl = $location.url().includes('join');

        if (isJoinUrl) {
            gameManager.gameDetails($routeParams.id, true)
                .then(function (gameDetails) {
                    identity.getUser()
                        .then(function (user) {

                            if (!!gameDetails.SecondPlayerName ||
                                gameDetails.State !== 0 ||
                                gameDetails.FirstPlayerName === user.Email) {
                                notifier.error('Game not available.', 'An error');
                                $location.path('/games/all');
                            }

                            vm.joinGameDetails = gameDetails;
                        });
                }, function (error) {
                    notifier.error(error.data.Message || '', 'Game not found!');
                    $location.path('/games/all');
                });
        }

        if ($routeParams.id && !isJoinUrl) {

            GameDetails();
            promiseToDestroy = $interval(GameDetails, 3000);
        }

        $scope.$on('$destroy', function () {
            // Make sure that the interval is destroyed too
            $interval.cancel(promiseToDestroy);
        });

        getAllGames();

        vm.getAllGames = getAllGames;

        function getAllGames(state, gameName, playerName, count, order) {
            vm.isLoaded = false;
            gameManager.allGames(state, gameName, playerName, count, order)
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

        vm.change = function (isChecked, game) {
            if (!isChecked) {
                game.password = '';
            }
        };

        vm.createGame = function (game) {
            vm.isGameCreating = true;
            gameManager.createGame(game)
                .then(function (gameId) {
                    notifier.success('Game created', 'Success!');
                    vm.isGameCreating = false;
                    $location.path('/game/' + gameId);
                }, function (errResponse) {
                    notifier.error(errResponse.data.Message || 'Cannot create game', 'Error');
                    vm.isGameCreating = false;
                });
        };

        vm.joinGame = function (id, password) {
            vm.isInGameJoiningProcess = true;
            gameManager.joinGame(id, password)
                .then(function (gameId) {
                    notifier.success('You just joined in the game!', 'Success!');
                    vm.isInGameJoiningProcess = false;
                    $location.path('/game/' + gameId);
                }, function (error) {
                    vm.isInGameJoiningProcess = false;
                    notifier.error(error.data.Message || '', 'Error!');
                });
        };

        vm.play = function (tile, playTileForm) {
            if (!playTileForm.$dirty) {
                notifier.warning('First chose a tile!', 'Warning');
                return;
            }

            if (vm.gameInfo.State >= 3) {
                notifier.warning('Game already finished!', 'Warning');
                return;
            }

            if (vm.gameInfo.State === 0) {
                notifier.warning('You must wait for opponent!', 'Warning');
                return;
            }

            tile.gameId = vm.gameInfo.Id;
            gameManager.play(tile)
                .then(function () {
                    /// Success play
                    GameDetails();

                    // start waiting again
                    $interval.cancel(promiseToDestroy);
                    promiseToDestroy = $interval(GameDetails, 3000);
                }, function (errorResponse) {
                    var errors = {};
                    notifier.error(errorResponse.data.Message, 'Error');

                    if (errorResponse.data && errorResponse.data.ModelState && errorResponse.data.ModelState[""]) {
                        errors = errorResponse.data.ModelState[""];

                        for (var ind in errors) {
                            if (errors.hasOwnProperty(ind)) {
                                notifier.error(errors[ind], errorResponse.statusText);
                            }
                        }
                    }
                });
        };

        vm.copyLink = function (gameId) {
            var inputShareLink = document.createElement('input');
            // var inputShareLink = document.getElementById(elementId);
            inputShareLink.value = document.location.host + '/game/join/' + gameId;
            inputShareLink.style.position = "absolute";
            inputShareLink.style.left = "-120%";
            inputShareLink.style.top = "0";
            inputShareLink.id = 'copy-link';

            document.body.appendChild(inputShareLink);

            inputShareLink.select();
            var resultCopy = document.execCommand('copy');

            document.body.removeChild(inputShareLink);
        };

        function GameDetails() {
            var idOfTheGame = $routeParams.id,
                currentUserName = identity.getUserNoPromise().Email;

            function stopIntervalIfBoardChanged(newGameInfo) {

                function userMatchCriteria(curentGameInfo, symbol, userName) {
                    return (curentGameInfo.FirstPlayerSymbol === symbol && curentGameInfo.FirstPlayerName === userName) ||
                        (curentGameInfo.SecondPlayerSymbol === symbol && curentGameInfo.SecondPlayerName === userName);
                }

                if (!vm.gameInfo || newGameInfo.State === 0) {
                    return;
                }

                // If game is finished stop
                if (newGameInfo.State >= 3) {
                    var winSymbol = newGameInfo.State === 3 ? 'X' : 'O';

                    if (newGameInfo.State === 5) {
                        notifier.warning('Draw!', '');
                    } else if (userMatchCriteria(newGameInfo, winSymbol, currentUserName)) {
                        notifier.success('You win!', 'Congratulations');
                    } else {
                        notifier.error('You lose!', 'Game over');
                    }

                    $interval.cancel(promiseToDestroy);
                    return;
                }

                // if opponent comes - stop
                if (vm.gameInfo.SecondPlayerName !== newGameInfo.SecondPlayerName) {
                    notifier.warning('Opponent just join', 'Info');
                    $('#btn-share').remove();
                    $interval.cancel(promiseToDestroy);
                    return;
                }

                var currentSymbol = newGameInfo.State === 1 ? 'X' : 'O';

                // 1 - turn X
                // if player is first to play stop
                if (userMatchCriteria(newGameInfo, currentSymbol, currentUserName)) {
                    $interval.cancel(promiseToDestroy);
                    return;
                }
            }

            if (!idOfTheGame) {
                return;
            }

            gameManager.gameDetails(idOfTheGame)
                .then(function (gameDetails) {

                    stopIntervalIfBoardChanged(gameDetails);

                    vm.gameInfo = gameDetails;

                    if (vm.gameInfo.State >= 3) {
                        // the game is already finished
                        $interval.cancel(promiseToDestroy);
                    }

                }, function (error) {
                    $interval.cancel(GameDetails);
                    notifier.error('Reasons: id or you are not participate in the game', 'Game not found!');
                    $location.path('/games/all');
                });
        }
    }

    angular.module('tttGame.controllers')
        .controller('GameController', ['$location', '$routeParams', '$interval', 'notifier', 'gameManager', '$scope', 'identity', GameController]);

}());
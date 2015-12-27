/*globals angular*/

(function () {
    "use strict";

    function filterForGameState() {
        return function (input) {
            switch (input) {
                case 0:
                    return "Waiting for opponent!";
                case 1:
                    return "First player turn.";
                case 2:
                    return "Second player turn.";
                case 3:
                    return "First player won";
                case 4:
                    return "Second player won";
                case 5:
                    return "Draw. Deal with it.";
                default:
            }
        };
    }

    angular.module('tttGame.filters')
        .filter('gameStateFilter', filterForGameState);
}());
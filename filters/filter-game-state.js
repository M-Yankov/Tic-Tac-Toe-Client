/*globals angular*/

(function () {
    "use strict";

    function filterForGameState() {
        return function (input) {
            switch (input.state) {
                case 0:
                    return "Waiting for opponent!";
                case 1:
                case 2:
                    if ((input.firstPlayerSymbol === 'X' && input.state === 1) ||
                        (input.firstPlayerSymbol === 'O' && input.state === 2)) {
                        return "First player turn.";
                    }

                    return "Second player turn.";
                case 3:
                case 4:
                    if ((input.firstPlayerSymbol === 'X' && input.state === 3) ||
                        (input.firstPlayerSymbol === 'O' && input.state === 4)) {
                        return "First player won";
                    }

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
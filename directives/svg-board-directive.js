/*globals angular*/
(function () {
    'use strict';

    angular.module('tttGame.directives')
        .directive('svgBoard', ['svgDrawer', function (svgDrawer) {
            return {
                restrict: 'A',
                templateUrl: '',
                scope: {
                    board: '=board'
                },
                link: function (scope, element) {
                    var imageConfig = {
                        path: '',
                        width: 40,
                        height: 40,
                        offsetX: 5,
                        offsetY: 5
                    };

                    for (var i = 0, row = 0, col = 0; i < scope.board.length; i += 1, col += 51) {
                        if (i % 3 === 0 && i !== 0) {
                            row += 51;
                            col = 0;
                        }

                        if (scope.board[i] === 'O') {
                            imageConfig.path = '../img/greenCircle_128.png';
                            svgDrawer.createRect(element, col, row, 50, '#454545', '#2a9fd6', 2, imageConfig);
                        } else if (scope.board[i] === 'X') {
                            imageConfig.path = '../img/reg_X_symbol_128.png';
                            svgDrawer.createRect(element, col, row, 50, '#454545', '#2a9fd6', 2, imageConfig);
                        } else {
                            svgDrawer.createRect(element, col, row, 50, '#454545', '#2a9fd6', 2);
                        }
                    }
                }
            };
        }]);
}());
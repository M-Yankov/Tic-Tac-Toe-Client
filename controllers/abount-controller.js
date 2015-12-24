/*globals angular*/

(function () {
    'use strict';
    function AboutController() {
        var vm = this;
        vm.linkToRepo = 'https://github.com/M-Yankov/Tic-Tac-Toe-Client';
    }

    angular.module('tttGame.controllers')
        .controller('AboutController', [AboutController]);
}());
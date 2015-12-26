/* globals angular*/
(function () {
    'use strict';
    function LoginController($location, auth, notifier) {

        var vm = this;
        vm.isProcessing = false;

        vm.logUser = function (user, form) {
            vm.hasError = false;
            vm.isProcessing = true;
            if (form.$valid) {
                auth.login(user)
                    .then(function (response) {
                        notifier.success(response.data.userName + '!', 'Welcome:');
                        $location.path('/');
                    }, function (err) {
                        if (err.data) {
                            notifier.error(err.data.error_description, err.statusText);
                        } else {
                            notifier.error(JSON.stringify(err), err.statusText);
                        }

                        vm.hasError = true;
                        vm.isProcessing = false;
                    });
            } else {
                notifier.error('Check requirements', 'Invalid form');
                vm.hasError = true;
                vm.isProcessing = false;
            }
        };
    }

    angular.module('tttGame.controllers')
        .controller('LoginController', ['$location', 'auth', 'notifier', LoginController]);
}());
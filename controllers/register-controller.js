/* globals angular */
(function () {
    'use strict';

    function RegisterController($location, auth, notifier) {
        var vm = this;
        vm.isProcessing = false;

        vm.makeRegistration = function (user, form) {
            vm.hasError = false;
            if (form.$valid) {
                vm.isProcessing = true;
                auth.userRegistration(user)
                    .then(function () {
                        notifier.success('Now you must login!', 'Success registration!');
                        vm.isProcessing = false;
                        $location.path('/login');
                    }, function (errorResponse) {
                        notifier.error('Contact support!','General error');
                        vm.hasError = true;
                        vm.isProcessing = false;

                        if(errorResponse.data && errorResponse.data.ModelState && errorResponse.data.ModelState[""])
                        {
                            var errors = errorResponse.data.ModelState[""];
                            for (var ind in errors) {
                                if (errors.hasOwnProperty(ind)) {
                                    notifier.error(errors[ind], errorResponse.statusText);
                                }
                            }
                        }
                    });
            } else {
                notifier.error('Invalid form!', 'See messages.');
                vm.hasError = true;
            }
        };
    }

    angular.module('tttGame.controllers')
        .controller('RegisterController', ['$location', 'auth', 'notifier', RegisterController]);
}());

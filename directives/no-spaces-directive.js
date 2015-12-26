/*globals angular*/
(function () {
    'use strict';

    angular.module('tttGame.directives')
        .directive('noSpaces', function () {
            return {
                require: 'ngModel',
                scope : {
                  input : '=noSpaces'
                },
                restrict: 'A',
                link: function (scope, element, attributes, ngModel) {

                    ngModel.$validators.noSpaces = function () {
                        //TODO : set this to work !/
                        /// http://plnkr.co/edit/Mb0uRyIIv1eK8nTg3Qng?p=preview
                    };

                }
            };
        });
}());
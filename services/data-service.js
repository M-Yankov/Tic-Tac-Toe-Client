/*globals angular*/
(function () {
    'use strict';

    function dataService($http, $q, domain) {


        /**
         *
         * @param {String} url Provide url starts without /. Domain is added automatically.
         * @param {Object} [queryParams] Optional parameters: ?age=20&name=John
         * @returns {promise} Resolve promise using .then(successCallback, errorCallback);
         */
        var getRequest = function (url, queryParams) {
            var deferred = $q.defer();
            $http.get(domain + url, {
                params: queryParams
            })
                .then(function (response) {
                    deferred.resolve(response.data);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         *
         * @param {String} url Provide url starts without /. Domain is added automatically.
         * @param {Object} [body] The body of the request.
         * @returns {$q.promise} Resolve promise using .then(successCallback, errorCallback);
         */
        var postRequest = function (url, body) {
            var deferred = $q.defer();

            $http.post(domain + url, body)
                .then(function (response) {
                   deferred.resolve(response.data);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        return {
            getRequest: getRequest,
            postRequest: postRequest
        };
    }

    angular.module('tttGame.services')
        .factory('dataService', ['$http', '$q', 'domain', dataService]);
}());
var app = angular.module('angularJWT', ['ui.bootstrap', 'ngCookies']);

app.factory('$modalogin', ['$rootScope', '$modal', '$http', '$cookieStore', '$q', function ($scope, $modal, $http, $cookie, $q) {
    
    return {
        login : function () {

            var deferred = $q.defer();
            
            if ($cookie.get('token')) {
                deferred.resolve($cookie.get('token'));
                return deferred.promise;
            }          

            var scope = $scope.$new(false);
            
            var modal = $modal.open({
                templateUrl: '/static/templates/modal_auth.html',
                scope: scope,
                keyboard: false,
            });

            scope.auth = {};
            scope.error = '';

            scope.do_auth = function () {
                $http({
                    url: '/auth',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: scope.auth,
                }).success(function(data, status) {
                    $cookie.put('token', data.token);
                    modal.close();
                    deferred.resolve(data.token);
                }).error(function(data, status) {
                    scope.error = data.description;
                });

            };
            
            return deferred.promise;
        }
    };

}]);

var TestCtrl = function($scope, $modalogin, $http) {
    
    $scope.results = [];

    $scope.protected = function () {
        $modalogin.login().then(function (token) {
            $http({url: '/protected', method: 'GET', headers: {'Authorization': 'Bearer ' + token}}).success(function (data, s){
                $scope.results.push(data);
            });
        });
    };
} 

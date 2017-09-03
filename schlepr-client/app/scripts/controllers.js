'use strict';

angular.module('schleprApp')

.controller('HeaderController', ['$scope', '$uibModal', '$log', '$state', '$rootScope', '$localStorage', 'AuthFactory', 
    function ($scope, $uibModal, $log, $state, $rootScope, $localStorage, AuthFactory) {
    $scope.isNavCollapsed = true;
    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.openRegisterModal = function () {
        var registerModalInstance = $uibModal.open({
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        });

        registerModalInstance.result.then(function () {
            $log.info('Registration Modal closed at: ' + new Date());
            }, function () {
                $log.info('Registration Modal dismissed at: ' + new Date());
            }
        );
    };

    $scope.doLogin = function() {
        $log.info('Do login: ' + new Date());
        if($scope.rememberMe) {
            $localStorage.storeObject('userinfo',$scope.loginData);
        }
        AuthFactory.login($scope.loginData);
    };
    
    $scope.logOut = function() {
        $log.info('Do logout: ' + new Date());
        $scope.loginData.password = "";
        AuthFactory.logout();
    };

    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };

    $scope.openRequestModal = function () {
        var requestModalInstance = $uibModal.open({
            templateUrl: 'views/new-request.html',
            controller: 'NewRequestController',
            size: 'lg',
            windowClass: 'request-modal-z-index',
            backdropClass: 'request-modal-backdrop-z-index'
        });

        requestModalInstance.result.then(function () {
            $log.info('New request modal closed at: ' + new Date());
            }, function () {
                $log.info('New request modal dismissed at: ' + new Date());
            }
        );
    };
}])

.controller('RegisterController', ['$scope', '$uibModalInstance', '$log', 'AuthFactory', function ($scope, $uibModalInstance, $log, AuthFactory) {
    $scope.registerData = {};

    $scope.doRegister = function() {
        $log.info('Doing registration', $scope.registerData);
        AuthFactory.register($scope.registerData);
        $uibModalInstance.close();
    };

    $scope.dismissThisDialog = function() {
        $uibModalInstance.dismiss();
    };
}])

.controller('NewRequestController', ['$scope', '$uibModalInstance', '$log', 'PackageFactory', 
    function ($scope, $uibModalInstance, $log, PackageFactory) {
    $scope.package = {};

    $scope.doAddRequest = function() {
        $log.info('Doing add new request', $scope.package);
        if($scope.tempDate) {
            $scope.package.date = $scope.tempDate;
        }
        PackageFactory.save($scope.package);
        $uibModalInstance.close();
    };

    $scope.dismissThisDialog = function() {
        $uibModalInstance.dismiss();
    };    
}])

.controller('HomeController', ['$scope', '$log', 'PackageFactory', function ($scope, $log, PackageFactory) {
    $scope.packages = PackageFactory.query();
    $log.info($scope.packages);
}])
;
'use strict';

angular.module('schleprApp')

.controller('HeaderController', ['$scope', '$uibModal', '$log', '$state', '$rootScope', 'AuthFactory', 
    function ($scope, $uibModal, $log, $state, $rootScope, AuthFactory) {
    $scope.isNavCollapsed = true;
    $scope.loginData = {};
    $rootScope.requestModalOpened = false;

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
        $rootScope.requestModalOpened = true;
        var requestModalInstance = $uibModal.open({
            templateUrl: 'views/request.html',
            controller: 'NewRequestController',
            size: 'lg',
            windowClass: 'request-modal-z-index',
            backdropClass: 'request-modal-backdrop-z-index'
        });

        requestModalInstance.result.then(function () {
            $log.info('New request modal closed at: ' + new Date());
            $rootScope.requestModalOpened = false;
            }, function () {
                $log.info('New request modal dismissed at: ' + new Date());
                $rootScope.requestModalOpened = false;
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

.controller('NewRequestController', ['$scope', '$uibModalInstance', '$log', 'PackageFactory', 'AuthFactory',
    function ($scope, $uibModalInstance, $log, PackageFactory, AuthFactory) {
    $scope.package = {};
    $scope.editMode = true;

    $scope.doSaveRequest = function() {
        $log.info('Doing add new request', $scope.package);

        $scope.package.postedBy = AuthFactory.getUserid();
        PackageFactory.save($scope.package);
        $uibModalInstance.close();
    };

    $scope.dismissThisDialog = function() {
        $uibModalInstance.dismiss();
    };    
}])

.controller('EditRequestController', ['$scope', '$uibModalInstance', '$log', 'PackageFactory',
    function ($scope, $uibModalInstance, $log, PackageFactory) {

    $scope.doSaveRequest = function() {
        PackageFactory.update({id: $scope.$parent.package._id}, $scope.$parent.package, $scope.$parent.packageClone);
        $uibModalInstance.close();
    };

    $scope.doDeleteRequest = function() {
        PackageFactory.delete({id: $scope.$parent.package._id});
        $uibModalInstance.close();
    };

    $scope.dismissThisDialog = function() {
        $uibModalInstance.dismiss();
    };

    $scope.setEditMode = function() {
        $scope.$parent.editMode = true;
    };

}])

.controller('HomeController', ['$scope', '$rootScope', '$log', '$uibModal', 'PackageFactory', function ($scope, $rootScope, $log, $uibModal, PackageFactory) {
    var getIndex = function(aPackage) {
        // TODO: may need and index for faster lookup
        var index = -1;
        $scope.packages.map(function(item, i) {
            if(item._id === aPackage._id) {
                index = i;
            }
        });
        return index;
    };

    $scope.packages = PackageFactory.query();
    $log.info($scope.packages);

    $scope.$on('save:Successful', function (event, newPackage) {
        $scope.packages.unshift(newPackage);
    });

    // successful updates are taken care of automatically because of binding to template via ng-model
    $scope.$on('update:unSuccessful', function (event, packageClone) {
        var index = getIndex(packageClone);
        if(index > -1) {
            $scope.packages[index] = packageClone;
        }
    });

    $scope.$on('delete:Successful', function (event, deletedPackage) {
        var index = getIndex(deletedPackage);
        if(index > -1){
            $scope.packages.splice(index, 1);
        }
    });

    $scope.onRequestClicked = function (index) {
        $rootScope.requestModalOpened = true;
        var parentScope = $rootScope.$new();
        parentScope.package = $scope.packages[index];
        parentScope.package.date = new Date(parentScope.package.date);
        parentScope.packageClone = PackageFactory.getClone(parentScope.package); // use to revert to old state; in event of error during update
        parentScope.editMode = false;

        var requestModalInstance = $uibModal.open({
            templateUrl: 'views/request.html',
            controller: 'EditRequestController',
            scope: parentScope,
            size: 'lg',
            windowClass: 'request-modal-z-index',
            backdropClass: 'request-modal-backdrop-z-index'
        });

        requestModalInstance.result.then(function () {
            $log.info('Edit request modal closed at: ' + new Date());
            $rootScope.requestModalOpened = false;
            }, function () {
                $log.info('Edit request modal dismissed at: ' + new Date());
                $rootScope.requestModalOpened = false;
            }
        );
    };
}])
;
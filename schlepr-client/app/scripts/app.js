'use strict';

angular.module('schleprApp', ['ngResource', 'ui.bootstrap', 'ui.router', 'ngAutocomplete', 'moment-picker'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $stateProvider
    
    // route for the home page
    .state('app', {
        url:'/',
        views: {
            'header': {
                templateUrl : 'views/header.html',
                controller  : 'HeaderController'
            },
            'content': {
                templateUrl : 'views/home.html',
                controller  : 'HomeController'
            },
            'footer': {
                templateUrl : 'views/footer.html',
            }
        }

    });

    $urlRouterProvider.otherwise('/'); 
}])
.run(['$rootScope', 'AuthFactory', function($rootScope, AuthFactory) {
    $rootScope.isAuthenticated = AuthFactory.isAuthenticated();
    $rootScope.username = AuthFactory.getUsername();
    $rootScope.user_id = AuthFactory.getUserid(); 

    $rootScope.$on('login:Successful', function () {
        $rootScope.isAuthenticated = AuthFactory.isAuthenticated();
        $rootScope.username = AuthFactory.getUsername();
        $rootScope.user_id = AuthFactory.getUserid(); 
    });
        
    $rootScope.$on('registration:Successful', function () {
        $rootScope.isAuthenticated = AuthFactory.isAuthenticated();
        $rootScope.username = AuthFactory.getUsername();
        $rootScope.user_id = AuthFactory.getUserid(); 
    });

    $rootScope.$on('logout:Successful', function () {
        $rootScope.isAuthenticated = AuthFactory.isAuthenticated();
        $rootScope.username = AuthFactory.getUsername();
        $rootScope.user_id = AuthFactory.getUserid(); 
    });
}])
;

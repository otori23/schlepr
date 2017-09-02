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

    /*
    // route for the aboutus page
    .state('app.aboutus', {
        url:'aboutus',
        views: {
            'content@': {
                templateUrl : 'views/aboutus.html',
                controller  : 'AboutController'                  
            }
        }
    })

    // route for the contactus page
    .state('app.contactus', {
        url:'contactus',
        views: {
            'content@': {
                templateUrl : 'views/contactus.html',
                controller  : 'ContactController'                  
            }
        }
    })

    // route for the menu page
    .state('app.menu', {
        url: 'menu',
        views: {
            'content@': {
                templateUrl : 'views/menu.html',
                controller  : 'MenuController'
            }
        }
    })

    // route for the dishdetail page
    .state('app.dishdetails', {
        url: 'menu/:id',
        views: {
            'content@': {
                templateUrl : 'views/dishdetail.html',
                controller  : 'DishDetailController'
           }
        }
    })

    // route for the dishdetail page
    .state('app.favorites', {
        url: 'favorites',
        views: {
            'content@': {
                templateUrl : 'views/favorites.html',
                controller  : 'FavoriteController'
           }
        }
    });*/

    $urlRouterProvider.otherwise('/'); 
}])

.run(['$rootScope', 'AuthFactory', function($rootScope, AuthFactory) {
    $rootScope.$on('login:Successful', function () {
        $rootScope.loggedIn = AuthFactory.isAuthenticated();
        $rootScope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $rootScope.loggedIn = AuthFactory.isAuthenticated();
        $rootScope.username = AuthFactory.getUsername();
    });

    $rootScope.$on('logout:Successful', function () {
        $rootScope.loggedIn = AuthFactory.isAuthenticated();
        $rootScope.username = AuthFactory.getUsername();
    });
}])
;

'use strict';

angular.module('schleprApp')
.constant("baseURL", "http://localhost:3000/")

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', '$uibModal', '$log', 'baseURL',
 function($resource, $http, $localStorage, $rootScope, $window, $uibModal, $log, baseURL){
    
  var authFac = {};
  var APP_KEY = 'schleprApp';
  var isAuthenticated = false;
  var username = '';
  var authToken = undefined;
  var _id = '';  

  function useCredentials(credentials) {
    isAuthenticated = credentials.isAuthenticated;
    username = credentials.username;
    authToken = credentials.token;
    _id = credentials._id;

    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(APP_KEY,'{}');
    if (credentials.username !== undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(APP_KEY, credentials);
    useCredentials(credentials);
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    _id = '';
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(APP_KEY);
  }

  authFac.login = function(loginData) {      
    $resource(baseURL + "users/login")
    .save(loginData,
      function(response) {
        $log.info("Login Success: " + response);
        storeUserCredentials({_id: response._id, username:loginData.username, isAuthenticated: true, token: response.token});
        $rootScope.$broadcast('login:Successful');
      },
      function(response){
        $log.info("Login Failure: " + response);
        destroyUserCredentials();

        var message =
          '<div class="modal-header">' +
          '<h3 class="modal-title" id="modal-title-login">Login Unsuccessful</h3>' +
          '</div>' +
          '<div class="modal-body" id="modal-body-login">' + 
          '<p>' +  response.data.err.message + '</p>' +
          '<p>' +  response.data.err.name + '</p>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button type="button" class="btn btn-primary" ng-click=$close()>OK</button>' +
          '</div>';

          $uibModal.open({ template: message, backdrop: false });
      }
    );
  };
    
  authFac.logout = function() {
    $resource(baseURL + "users/logout").get(function(response){
        $rootScope.$broadcast('logout:Successful');
    });
    destroyUserCredentials();
  };
    
  authFac.register = function(registerData) {
    $resource(baseURL + "users/register")
    .save(registerData,
      function(response) {
        authFac.login({username:registerData.username, password:registerData.password});
        if (registerData.rememberMe) {
          $localStorage.storeObject('userinfo', {username:registerData.username, password:registerData.password});
        }
        $rootScope.$broadcast('registration:Successful');
      },
      function(response){
        var message =
          '<div class="modal-header">' +
          '<h3 class="modal-title" id="modal-title-login">Registration Unsuccessful</h3>' +
          '</div>' +
          '<div class="modal-body" id="modal-body-registration">' + 
          '<p>' +  response.data.err.message + '</p>' +
          '<p>' +  response.data.err.name + '</p>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button type="button" class="btn btn-primary" ng-click=$close()>OK</button>' +
          '</div>';

          $uibModal.open({ template: message, backdrop: false });
      }
    );
  };
    
  authFac.isAuthenticated = function() {
    return isAuthenticated;
  };
  
  authFac.getUsername = function() {
    return username;  
  };

  authFac.getUserid = function() {
    return _id;  
  };

  loadUserCredentials();
  
  return authFac;   
}])

.factory('PackageFactory', ['$resource', '$uibModal', '$rootScope', 'baseURL', function ($resource, $uibModal, $rootScope, baseURL) {
  var packageFac = {};
  var packageResource = $resource(baseURL + "packages/:id", null, {'update': {method: 'PUT'}});

  packageFac.save = function(packageData) {
    packageResource
    .save(packageData,
      function(response) {
          $rootScope.$broadcast('save:Successful', response);
          var message =
          '<div class="modal-header">' +
          '<h3 class="modal-title id="modal-title-request">Success!</h3>' +
          '</div>' +
          '<div class="modal-body" id="modal-body-request">' + 
          '<p>' +  "All good. Your request was saved!"  + '</p>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button type="button" class="btn btn-primary" ng-click=$close()>OK</button>' +
          '</div>';

          $uibModal.open({ template: message, backdrop: false });
      },
      function() {
          var message =
          '<div class="modal-header">' +
          '<h3 class="modal-title id="modal-title-request">Unable to Save Your Request!</h3>' +
          '</div>' +
          '<div class="modal-body" id="modal-body-request">' + 
          '<p>' +  "There was an error saving your request to server!"  + '</p>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button type="button" class="btn btn-primary" ng-click=$close()>OK</button>' +
          '</div>';

          $uibModal.open({ template: message, backdrop: false });
      }
    );
  };

  packageFac.query = function() {
    return packageResource.query();
  };

  return packageFac;
}])
;
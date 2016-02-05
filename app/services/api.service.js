'use strict';

angular.module('api', ['ngResource'])
  .config(['$authProvider', function ($authProvider) {
    // TODO: construct the url in a cleaner way
    console.log('laksjdflksadjf')
    var confirmationUrl = window.location.origin + '/#/users/login';
    $authProvider.configure({
      apiUrl: window.backendUrl,
      storage: 'localStorage',
      confirmationSuccessUrl: confirmationUrl
      omniauthWindowType: 'sameWindow',
      authProviderPaths: {
        github:   '/auth/github',
        facebook: '/auth/facebook',
        google:   '/auth/google'
      }
    });
  }])
  .factory('Resource', ['$resource', function ($resource) {
    return function (url, params, methods) {
      var defaults = {
        update: {method: 'put', isArray: false},
        create: {method: 'post'}
      };

      methods = angular.extend(defaults, methods);

      var resource = $resource(url, params, methods);

      resource.prototype.$save = function () {
        if (this.id) {
          return this.$update();
        }
        else {
          return this.$create();
        }
      };

      return resource;
    };
  }])
  .factory('$api', ['Resource', '$auth', function ($resource, $auth) {
    var apiService = {};

    apiService.apiUrl = window.backendUrl;

    apiService.endpoint = function (path) {
      return $auth.apiUrl() + '/' + path;
    };

    apiService.users = $resource(apiService.endpoint('users/:id'), {id: "@id"}, {
      can: {
        isArray: false,
        method: 'GET',
        url: apiService.endpoint('/users/can/'),
        params: {verb: "@verb", object_id: "@object_id", object_type: "@object_type"}
      }
    });

    return apiService;
  }]);
(function() {
  'use strict';

  angular.module('app.login')
    .controller('LoginController', LoginController);

  /* @ngInject */
  function LoginController($rootScope, $stateParams, md5, ApiFactory) {
    var ctrl = this;

    function loginFailed() {
      $rootScope.$emit('app.components.error.ErrorMessage', 'Login attempt failed. Please try again.');
    }

    function getAuthString(username, password, token) {
      var pswdHash = md5.createHash(username + ':' + 'com.acm.AMMusicServer' + ':' + password);
      return md5.createHash(token + ':' + username + ':' + pswdHash + ':' + token);
    }

    function submitSessionRequest(token, authString) {
      ApiFactory.session.getSession(token, authString).then(function(data) {
        $rootScope.$emit('loginSuccess', {
          Key: data.Session,
          Secret: data.Secret
        });
      }, function() {
        loginFailed();
      });
    }

    function login() {
      ApiFactory.session.getToken().then(function(data) {
        var authString = getAuthString(ctrl.auth.username, ctrl.auth.password, data.Token);
        submitSessionRequest(data.Token, authString);
      }, function() {
        loginFailed();
      });
    }

    function attemptAutoLogin() {
      if ($stateParams.token && $stateParams.auth) {
        submitSessionRequest($stateParams.token, $stateParams.auth);
      }
    }

    angular.extend(this, {
      auth: {},
      login: login,
      attemptAutoLogin: attemptAutoLogin
    });
  }
})();

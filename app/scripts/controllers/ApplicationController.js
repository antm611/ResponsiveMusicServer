'use strict';

angular.module('musicServerApp')
    .controller('ApplicationController', ['$scope', '$rootScope', '$location', 'matchmedia', 'SessionData', 'ApiRequest',
        function ($scope, $rootScope, $location, matchmedia, SessionData, ApiRequest) {
            matchmedia.onDesktop(function(mql) {
                $scope.isDesktop = mql.matches;
            });
            matchmedia.onPhone(function(mql) {
                $scope.isPhone = mql.matches;
            });

            window.onbeforeunload = function() {
                if ($scope.loggedIn && !window.LiveReload) {
                    return 'Reloading or closing this page will stop playback!';
                }
            };

            $scope.verifyLoggedIn = function () {
                var currentPath = $location.path();
                if (currentPath === '/login') {
                    SessionData.clearSession();
                }

                $scope.loggedIn = !!SessionData.getSession().Key;

                if (!$scope.loggedIn && currentPath !== '/login') {
                    $location.path('/login');
                }
                $scope.scrobblingEnabled = SessionData.getUserPreference('ScrobblingEnabled');
            };

            $scope.toggleScrobblingEnabled = function() {
                $scope.scrobblingEnabled = !$scope.scrobblingEnabled;
                SessionData.setUserPreference('ScrobblingEnabled', $scope.scrobblingEnabled);
            };

            $scope.$on('changeLocation', function (event, newLocation) {
                $location.path(newLocation);
                $scope.verifyLoggedIn();
            });

            $scope.$on('loginSuccess', function (event, sessionData) {
                SessionData.setSession(sessionData);
                $scope.loggedIn = true;
                $location.path('/music');
                ApiRequest.session.getUserPreferences().submit().then(function(data) {
                    SessionData.setUserPreferences(data);
                    $scope.scrobblingEnabled = SessionData.getUserPreference('ScrobblingEnabled');
                });
            });

            $rootScope.$on('$locationChangeSuccess', function() {
                $scope.verifyLoggedIn();
            });

            $rootScope.$on('$routeChangeSuccess', function(event, currentRoute) {
                $rootScope.title = currentRoute.title;
            });

            $rootScope.$on('ResponseUnauthorised', function() {
                $rootScope.$emit('errorDisplay', 'Your session has timed out, and you have been logged out.');
                SessionData.clearSession();
                $scope.verifyLoggedIn();
            });

            $rootScope.$on('hideDropdowns', function(e, data) {
                if (!(data && data === 'error')) {
                    $scope.errorMessage = '';
                }
            });

            $rootScope.$on('errorDisplay', function(e, errorMessage) {
                $scope.errorMessage = errorMessage;
            });

            $scope.verifyLoggedIn();
        }]);

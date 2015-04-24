angular.module('drf_auth.token')
  .controller('LoginCtrl', function ($scope, $rootScope, $location, $window, $state, httpInterceptor, api, Auth, BACKEND_SERVER) {
    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function (credentials) {
      Auth.setCredentials($rootScope, BACKEND_SERVER, credentials);
      console.log('credentials set', $rootScope.loggedIn);
      //$window.location.href = $window.location.href.replace('/#/login', '/#/posts');
      //$window.location.reload();
    };
    $scope.logout = function () {
      Auth.clearCredentials();
      $state.go('login');
    };
    $scope.loggedIn = $rootScope.loggedIn;
    if ($scope.loggedIn === true) {
      $state.go('posts');
    }
  });

angular.module('drf_auth.token')
  .controller('LoginCtrl', function ($scope, $rootScope, $location, $window, $state, httpInterceptor, api, Auth, BACKEND_SERVER) {
    console.log('login controller');
    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function (credentials) {
      Auth.setCredentials(credentials).then(
        function () {
          console.log('credentials set', $rootScope.loggedIn, $rootScope.returnToState);
          var returnState = $rootScope.returnToState;
          if (returnState === undefined) {
            // Default if no return state set
            returnState = 'tab.dash';
          } else {
            returnState = returnState.name;
          }
          $state.go(returnState);
        },
        function () {

        });

    };
    $scope.loggedIn = $rootScope.loggedIn;
    if ($scope.loggedIn === true) {
      console.log('Already logged in, skipping');
      $state.go('tab.dash');
    }
  })
  .controller('LogoutCtrl', function ($scope, $state, Auth) {
    $scope.logout = function () {
      Auth.clearCredentials();
      $state.go('login');
    };
  });

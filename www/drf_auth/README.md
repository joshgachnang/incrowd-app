Angular Auth for Django Rest Framework
======================================

To use, include both files in your index.html
    
    <script src="drf_auth/auth_service.js"></script>
    <script src="drf_auth/auth_controller.js"></script>



Create a state for the login controller (using ui-router here)
    
    angular.module('yourmodule', ['drf_auth'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('login', {
            url: '/login',
            views: {
              templateUrl: 'drf_auth/login.html',
              controller: 'AuthCtrl'
            }
          })

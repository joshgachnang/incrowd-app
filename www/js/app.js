// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ngCookies', 'ngMaterial', 'djangoRESTResources', 'starter.controllers', 'starter.services', 'pusher.service', 'drf_auth.token', 'incrowd'])
  .run(function ($ionicPlatform, $rootScope, $state, $cordovaPush, Auth, GCM_ID, Mobile) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });

    // Watch state changes, check if authed, if not, redirect to login
    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
      // redirect only not authenticated and on auth required states
      var no_auth_states = ['login', 'signup'];
      console.log('checking if auth state is in no_auth_states', toState.name, no_auth_states.indexOf(toState.name))

      if ($rootScope.loggedIn !== true && no_auth_states.indexOf(toState.name) === -1) {
        // user is not authenticated. stow the state they wanted before you
        // send them to the signin state, so you can return them when you're done
        $rootScope.returnToState = $rootScope.toState;
        $rootScope.returnToStateParams = $rootScope.toStateParams;

        console.log('redirecting to login', toState.name, $rootScope.loggedIn);
        // now, send them to the signin state so they can log in
        $state.go('login'); // go to login
        e.preventDefault();
        //console.log('going')
      }
      else {
        console.log('auth state is in no_auth_states', toState.name)
      }
    });

  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.post', {
        url: '/post/:postId',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-post.html',
            controller: 'PostCtrl'
          }
        }
      })

      .state('tab.post-add', {
        url: '/post/add',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-add-post.html',
            controller: 'AddPostCtrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/chats');

  })
;

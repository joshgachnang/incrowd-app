angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $rootScope, $state, Posts) {
    "use strict";

    Posts.promise.then(function() {
      $scope.posts = Posts.posts;
    });

    $scope.doRefresh = function () {
      $scope.posts = Posts.resource.query();
      $scope.$broadcast('scroll.refreshComplete');
    };
  })

  .controller('PostCtrl', function ($scope, $rootScope, $log, $mdToast, $stateParams, $state, Posts) {
    "use strict";

    $scope.postId = $stateParams.postId;
    $scope.post = Posts.resource.get({postId: $scope.postId});
    $scope.formData = new Posts.Comments.resource({post: $scope.postId});
    $scope.submitDisabled = false;

    function toast(msg) {
      $mdToast.show(
        $mdToast.simple()
          .content(msg)
          .position('bottom right')
          .hideDelay(3000)
      );
    }

    $scope.comment = function () {
      $scope.submitDisabled = true;
      $log.debug('submitting comment', $scope.formData);
      $scope.formData.$save().$promise.success(function () {
        cordova.plugins.Keyboard.close();
        $scope.formData = new Posts.Comments.resource({post: $scope.postId});
        toast('Comment successful!');
        $scope.submitDisabled = false;
      }).error(function (data) {
        $log.error('submit failed', data);
        $scope.submitDisabled = false;
      });
    };

    $rootScope.$on('$newComment', function (event, comment) {
      // TODO(JoshNang): Should be using caching and binding here
      $scope.post.comment_set.push(comment);
      console.log('new comment apply', comment);
    });

  })

  .directive('post', function () {
    "use strict";
    return {
      restrict: 'E',
      transclude: true,
      replace: false,
      templateUrl: 'partials/post.html'
    };
  })

  .controller('AddPostCtrl', function ($scope, $state, $log, $mdToast, Posts, Categories) {
    "use strict";
    $scope.post = new Posts.resource();
    $scope.categories = Categories.categories;
    $scope.submitDisabled = false;

    function toast(msg) {
      $mdToast.show(
        $mdToast.simple()
          .content(msg)
          .position('bottom right')
          .hideDelay(3000)
      );
    }

    $scope.new_post_submit = function () {
      if ($scope.submitDisabled === true) {
        return;
      }
      $scope.submitDisabled = true;
      $log.debug("submitting", $scope.post);
      var saved = $scope.post.$save();
      saved.$promise.success(function () {
        cordova.plugins.Keyboard.close();
        $scope.submitDisabled = false;
        $scope.post = new Posts.resource();
        $state.go('tab.dash');
        toast('Post successful');
      }).error(function (data) {
        cordova.plugins.Keyboard.close();
        $log.error('submit error', data);
        $scope.submitDisabled = false;
      });
    };

  })

  .controller('ChatsCtrl', function ($scope, $rootScope, $ionicScrollDelegate, Chats) {
    "use strict";
    $scope.formData = new Chats.resource();

    Chats.promise.then(function(messages) {
      $scope.chats = messages;
      $ionicScrollDelegate.scrollBottom();
    });

    $scope.remove = function (chat) {
      Chats.remove(chat);
    };

    $scope.send = function () {
      if ($scope.submitDisabled) {
        return;
      }
      $scope.submitDisabled = true;
      Chats.send($scope.formData).then(function () {
        cordova.plugins.Keyboard.close();
        $scope.submitDisabled = false;
        $scope.formData = new Chats.resource();
      });
    };

    // Scroll to the bottom on load
    $scope.$on('$ionicView.afterEnter', function () {
      $ionicScrollDelegate.scrollBottom();
    });

    $rootScope.$on('$newChatMessage', function () {
      $ionicScrollDelegate.scrollBottom();
    });
  })

  .controller('SettingsCtrl', function () {
    "use strict";
  })

  .controller('UserCtrl', function (Users, $scope) {
    "use strict";

    Users.promise.then(function() {
      $scope.users = Users.users;
      console.log($scope.users);
    });
  });

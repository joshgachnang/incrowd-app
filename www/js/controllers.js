angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $state, Posts) {
    $scope.posts = Posts.resource.query();
    console.log($scope.posts);
    $scope.go = function (id) {
      console.log('go');
      $state.go('tab.post', {postId: id})
    };
    $scope.doRefresh = function () {
      $scope.posts = Posts.resource.query();
      $scope.$broadcast('scroll.refreshComplete')
    };
  })

  .controller('PostCtrl', function ($scope, $mdToast, $stateParams, Posts, Comments) {
    $scope.postId = $stateParams.postId;
    $scope.post = Posts.resource.get({postId: $scope.postId});
    $scope.formData = new Comments.resource({post: $scope.postId});
    $scope.submitDisabled = false;

    $scope.comment = function () {
      $scope.submitDisabled = true;
      console.log('comment');
      $scope.formData.$save().$promise.success(function () {
        cordova.plugins.Keyboard.close();
        $scope.formData = new Comments.resource({post: $scope.postId});
        toast('Comment successful!');
        $scope.submitDisabled = false;
      }).error(function (data) {
        console.log('submit failed', data);
        $scope.submitDisabled = false;
      })
    };

    $scope.go = function (id) {
      console.log('go');
      $state.go('tab.post', {postId: id})
    };

    function toast(msg) {
      $mdToast.show(
        $mdToast.simple()
          .content(msg)
          .position('bottom right')
          .hideDelay(3000)
      );
    }
  })

  .directive('post', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: false,
      templateUrl: 'partials/post.html'
    }
  })

  .controller('AddPostCtrl', function ($scope, $state, $mdToast, Posts, Categories) {
    $scope.post = new Posts.resource();
    $scope.categories = Categories.categories;
    $scope.submitDisabled = false;

    $scope.new_post_submit = function () {
      if ($scope.submitDisabled === true) {
        return;
      }
      $scope.submitDisabled = true;
      console.log("submitting", $scope.post);
      var saved = $scope.post.$save();
      saved.$promise.success(function () {
        cordova.plugins.Keyboard.close();
        $scope.submitDisabled = false;
        $scope.post = new Posts.resource();
        $state.go('tab.dash');
        toast('Post successful')
      }).error(function (data) {
        cordova.plugins.Keyboard.close();
        console.log('submit error', data);
        $scope.submitDisabled = false;
      });
    };

    function toast(msg) {
      $mdToast.show(
        $mdToast.simple()
          .content(msg)
          .position('bottom right')
          .hideDelay(3000)
      );
    }

  })

  .controller('ChatsCtrl', function ($scope, $ionicScrollDelegate, Chats) {
    $scope.formData = new Chats.resource();
    $scope.chats = Chats.messages;
    console.log('chats', $scope.chats);
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
  })

  .controller('SettingsCtrl', function ($scope) {

  })

  .controller('UserCtrl', function ($scope) {

  });

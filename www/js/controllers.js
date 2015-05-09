angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, Posts) {
    $scope.posts = Posts.resource.query();
    console.log($scope.posts);
  })

  .controller('PostCtrl', function ($scope, $stateParams, Posts, Comments) {
    $scope.postId = $stateParams.postId;
    $scope.post = Posts.resource.get({postId: $scope.postId});
    $scope.formData = {post: $scope.postId};

    $scope.comment = function () {
      Comments.resource.save($scope.formData);
    };
    console.log($scope.post);
  })

  .directive('post', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: false,
      templateUrl: 'partials/post.html'
    }
  })

  .controller('AddPostCtrl', function ($scope) {
    $scope.post = {}
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    }
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('SettingsCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });

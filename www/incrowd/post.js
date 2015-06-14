angular.module('incrowd')
  .service('Posts', function ($q, $rootScope, BACKEND_SERVER, djResource) {
    "use strict";

    var Posts = {}, deferred = $q.defer();

    Posts.promise = deferred.promise;

    Posts.Comments = {};
    Posts.Comments.resource = djResource(BACKEND_SERVER + 'comments\/:commentId\/', {
      commentId: '@id'
    });

    Posts.posts = [];
    Posts.resource = djResource(BACKEND_SERVER + 'posts\/:postId\/', {
      postId: '@id',
      page: '@page',
      category: '@category',
      user: '@user'
    });

    Posts.resource.query().$promise.success(function (data) {
      Posts.posts = data.results;
      deferred.resolve(Posts.posts);
      //$rootScope.$apply();
    }).error(function () {
      deferred.reject();
    });

    Posts.tickle = function (id) {
      console.log('Posts tickle', id);
      Posts.resource.get({'postId': id}).$promise.success(function (post) {
        Posts.posts.unshift(post);
        $rootScope.$broadcast('$newPost');
      });
    };

    Posts.commentsTickle = function (id) {
      console.log('Comments tickle', id);
      Posts.Comments.resource.get({'commentId': id}).$promise.success(function (comment) {
        // Search for the matching post
        Posts.posts.forEach(function(post) {
          if (comment.post === post.id) {
            post.comment_set.push(comment);
          }
        });
        $rootScope.$broadcast('$newComment');
      });
    };

    return Posts;
  });

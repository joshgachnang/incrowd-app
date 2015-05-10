angular.module('incrowd')
  .service('Posts', function (BACKEND_SERVER, djResource) {
    var Post = {};
    Post.resource = djResource(BACKEND_SERVER + 'posts/:postId/', {
      postId: '@id',
      page: '@page',
      category: '@category',
      user: '@user'
    });
    return Post;
  });

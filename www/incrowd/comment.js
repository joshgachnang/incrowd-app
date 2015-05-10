angular.module('incrowd')
  .service('Comments', function (BACKEND_SERVER, djResource) {
    var Comment = {};
    Comment.resource = djResource(BACKEND_SERVER + 'comments/:commentId/', {
      commentId: '@id'
    });
    return Comment;

  });

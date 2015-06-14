angular.module('incrowd')
  .service('Users', function ($q, BACKEND_SERVER, djResource) {
    "use strict";

    console.log('user service');
    var Users = {}, deferred = $q.defer();

    Users.promise = deferred.promise;

    Users.Users = [];
    Users.resource = djResource(BACKEND_SERVER + 'users\/:userId\/', {
      userId: '@user'
    });

    Users.resource.query().$promise.success(function (data) {
      console.log(data);
      Users.users = data.results;
      deferred.resolve(Users.users);
      //$rootScope.$apply();
    }).error(function () {
      deferred.reject();
    });

    return Users;
  });

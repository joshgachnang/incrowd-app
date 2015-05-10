angular.module('incrowd')
  .service('Chats', function ($q, $rootScope, $log, djResource, BACKEND_SERVER, INCROWD_EVENTS) {
    var Chats = {};
    Chats.messages = [];
    Chats.promise = $q.defer();

    // Get the first page of results
    Chats.resource = djResource(BACKEND_SERVER + 'chat/messages\/', {}, {
      'get': {method: 'GET'},
      'save': {method: 'POST'},
      'query': {method: 'GET', isArray: true},
      'remove': {method: 'DELETE'},
      'delete': {method: 'DELETE'}
    });
    Chats.resource.query().$promise.success(function (data) {
      Chats.messages = data.results;
      Chats.promise.resolve(Chats.messages);
    }).error(function () {
      Chats.promise.reject();
    });

    // Catch push notifications
    $rootScope.$on(INCROWD_EVENTS.chat_message, function (event, message) {
      Chats.messages.push(message);
      $rootScope.$apply();
    });

    Chats.remove = function (msg) {
      Chats.resource.delete(msg.id).$promise.success(function () {
        var index = Chats.messages.indexOf(msg);
        Chats.messages.splice(index, 1);
      })
    };

    Chats.send = function (msg) {
      return msg.$save().$promise;
    };

    Chats.tickle = function(id) {
      // Tickles from push services, fetch the id
      var message = Chats.resource.get(id);
      $log.debug('Chat tickle', message);
      Chats.messages.push(message);
      $rootScope.$apply();
    };

    return Chats;
  });

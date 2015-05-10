angular.module('pusher.service', [])

  .factory('Channel', function ($rootScope, $http, BACKEND_SERVER, INCROWD_EVENTS, PUSHER_CHANNEL, PUSHER_APP_KEY, PUSHER_PRESENCE) {
    var Notifications = {};
    Notifications.pusher = new Pusher(PUSHER_APP_KEY, {
      auth: {
        headers: {'Authorization': 'Token ' + localStorage.getItem('token')}
      },
      authEndpoint: '/api/v1/pusher/auth'
    });
    Notifications.channel = Notifications.pusher.subscribe(PUSHER_CHANNEL);
    Notifications.presence = Notifications.pusher.subscribe(PUSHER_PRESENCE);
    Notifications.stream = [];

    var messageCallback = function (type, data) {
      // Call back on every Channel message. Broadcast out with type to
      // listeners
      data = angular.fromJson(data);

      if (data) {
        if (type == 'pusher:subscription_error') {
          // TODO(pcsforeducation) Handle this better
          console.log('Could not subscribe', data);
        }
        else if (type == 'pusher:subscription_succeeded') {
          $rootScope.$broadcast(INCROWD_EVENTS.subscribe, Notifications.presence.members);
        }
        else {
          console.log('Broadcasting unmatched event', type, data);
          $rootScope.$broadcast(type, angular.fromJson(data));
        }
      }
    };

    // Bind to all messages on our channels
    Notifications.channel.bind_all(messageCallback);
    Notifications.presence.bind_all(messageCallback);
    console.log('channel members', Notifications.presence.members);

    return Notifications;
  });

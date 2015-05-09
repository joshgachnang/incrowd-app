angular.module('starter.services', [])

  .service('Mobile', function ($rootScope, BACKEND_SERVER, djResource, GCM_ID) {
    var Mobile = {};

    Mobile.resource = djResource(BACKEND_SERVER + 'mobile/');

    $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
      if (notification.alert) {
        console.log(notification.alert);
      }

      if (notification.sound) {
        var snd = new Media(event.sound);
        snd.play();
      }

      if (notification.badge) {
        $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
          // Success!
        }, function (err) {
          // An error occurred. Show a message to the user
        });
      }
    });

    // Determine if we're on iOS or Android
    Mobile.isAndroid = function () {
      var uagent = navigator.userAgent.toLowerCase();
      return uagent.search('android') > -1;
    };

    // Register
    Mobile.register = function (token) {
      var config = null;

      if (ionic.Platform.isAndroid()) {
        config = {
          "senderID": GCM_ID // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
        };
      }
      else if (ionic.Platform.isIOS()) {
        config = {
          "badge": "true",
          "sound": "true",
          "alert": "true"
        }
      }

      $cordovaPush.register(config).then(function (result) {
        console.log("Register success " + result);
        $scope.registerDisabled = true;
        // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
        if (ionic.Platform.isIOS()) {
          $scope.regId = result;
          Mobile.storeDeviceToken($scope.regId);
        }
      });
    };

    // Android Notification Received Handler
    Mobile.handleAndroid = function (notification) {
      // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
      //             via the console fields as shown.
      console.log("In foreground " + notification.foreground + " Coldstart " + notification.coldstart);
      if (notification.event == "registered") {
        $scope.regId = notification.regid;
        Mobile.storeDeviceToken($scope.regId);
      }
      else if (notification.event == "message") {
        $cordovaDialogs.alert(notification.message, "Push Notification Received");
        $scope.$apply(function () {
          $scope.notifications.push(JSON.stringify(notification.message));
        })
      }
      else if (notification.event == "error")
        $cordovaDialogs.alert(notification.msg, "Push notification error event");
      else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
    };

    // IOS Notification Received Handler
    Mobile.handleIOS = function (notification) {
      // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
      // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
      // the notification when this code runs (weird).
      if (notification.foreground == "1") {
        // Play custom audio if a sound specified.
        if (notification.sound) {
          var mediaSrc = $cordovaMedia.newMedia(notification.sound);
          mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
        }

        if (notification.body && notification.messageFrom) {
          $cordovaDialogs.alert(notification.body, notification.messageFrom);
        }
        else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

        if (notification.badge) {
          $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
            console.log("Set badge success " + result)
          }, function (err) {
            console.log("Set badge error " + err)
          });
        }
      }
      // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
      // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
      // the data in this situation.
      else {
        if (notification.body && notification.messageFrom) {
          $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
        }
        else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
      }
    };

    // GCM debugging
    $rootScope.$on('$cordovaPush:tokenReceived', function (event, data) {
      console.log('Got token', data.token, data.platform);
      // Do something with the token
    });

    Mobile.storeDeviceToken = function (regId) {

    };

    return Mobile;
  })

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
      id: 2,
      name: 'Andrew Jostlin',
      lastText: 'Did you get the ice cream?',
      face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
    }, {
      id: 3,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
      id: 4,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });

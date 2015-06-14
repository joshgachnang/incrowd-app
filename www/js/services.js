angular.module('starter.services', [])

  .service('Mobile', function ($rootScope, $log, $cordovaPush, $cordovaDialogs, NotificationRegister, djResource, BACKEND_SERVER, INCROWD_EVENTS, GCM_ID, Chats, Posts, Users) {
    "use strict";

    var Mobile = {};

    Mobile.resource = djResource(BACKEND_SERVER + 'mobile/');

    $log.debug('Mobile startup');

    //$rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
    //  //$log.debug('Notification event: ', event, notification);
    //
    //  if (Mobile.isAndroid()) {
    //    Mobile.handleAndroid(notification);
    //  }
    //
    //  else {
    //    Mobile.handleIOS(notification);
    //  }
    //});
    $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
      console.log(JSON.stringify([notification]));
      console.log("notification event", event);

      if (ionic.Platform.isAndroid()) {
        Mobile.handleAndroid(notification);
      }
      else if (ionic.Platform.isIOS()) {
        Mobile.handleIOS(notification);
      }
    });

    // Determine if we're on iOS or Android
    Mobile.isAndroid = function () {
      var uagent = navigator.userAgent.toLowerCase();
      return uagent.search('android') > -1;
    };

    // Register
    Mobile.register = function (token) {
      $log.info('Registering device: ' + token);
      var config = null;

      if (ionic.Platform.isAndroid()) {
        config = {
          "senderID": GCM_ID
        };
      }
      else if (ionic.Platform.isIOS()) {
        config = {
          "badge": "true",
          "sound": "true",
          "alert": "true"
        };
      }

      $cordovaPush.register(config).then(function (result) {
        $log.debug("Register success ", result);
        //Mobile.registerDisabled = true;
        // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
        if (ionic.Platform.isIOS()) {
          Mobile.regId = result;
          Mobile.storeDeviceToken(Mobile.regId);
        }
      });
    };

    // Android Notification Received Handler
    Mobile.handleAndroid = function (notification) {
      // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
      //             via the console fields as shown.
      $log.debug("In foreground " + notification.foreground + " Coldstart " + notification.coldstart + " Event " + notification.event);
      if (notification.event === "registered") {
        Mobile.regId = notification.regid;
        Mobile.storeDeviceToken(Mobile.regId);
        NotificationRegister.register(Mobile.regId);
      }
      else if (notification.event === "message") {
        $log.info("Notification Message", notification);
        Mobile.dispatch(notification.payload);
      }
      else if (notification.event === "error") {
        $log.error("Notifcation error", notification);
      }
      else {
        $log.error("Notification other?", notification);
      }
    };

    // IOS Notification Received Handler
    Mobile.handleIOS = function (notification) {
      // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
      // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
      // the notification when this code runs (weird).
      if (notification.foreground === "1") {
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
            $log.debug("Set badge success " + result);
          }, function (err) {
            $log.debug("Set badge error " + err);
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

    Mobile.dispatch = function (payload) {
      // We have a push notification, send to the appropriate service
      var type = payload.type;
      $log.info("Dispatch type: " + type, payload);
      if (type === INCROWD_EVENTS.chat) {
        Chats.tickle(payload.id);
      }
      else if (type === INCROWD_EVENTS.post) {
        Posts.tickle(payload.id);
      }
      else if (type === INCROWD_EVENTS.comment) {
        Posts.commentsTickle(payload.id);
      }
      else if (type === INCROWD_EVENTS.notification) {
        console.log('notification')
      }
      else {
        $log.error('unknown push event dispatch', payload);
      }
      //$rootScope.$broadcast(type, Notifications.presence.members);
    };

    // GCM debugging
    $rootScope.$on('$cordovaPush:tokenReceived', function (event, data) {
      $log.debug('Got token' + data.token + 'platform: ' + data.platform);
      // Do something with the token
    });

    Mobile.storeDeviceToken = function (regId) {
      $log.debug('Storing device token', regId);
    };

    return Mobile;
  })

  .service('NotificationRegister', function ($cordovaDevice, $log, djResource, BACKEND_SERVER) {
    var Reg = {};
    Reg.resource = djResource(BACKEND_SERVER + 'register\/mobile\/');
    Reg.register = function (token, platform) {
      // token is the registration token
      // platform is 'android' or 'ios'
      var registration = new Reg.resource({
        'register': token,
        'platform': platform,
        'device_id': $cordovaDevice.getDevice().uuid
      });
      var reg_return = registration.$save();
      $log.debug("reg return", reg_return);
    };

    return Reg;
  });

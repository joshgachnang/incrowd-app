"use strict";

angular.module('incrowd', [])

  .constant('ENV', 'development')

  .constant('BACKEND_SERVER', 'http://docker:8000/api/v1/')

  .constant('PUSHER_CHANNEL', 'private-incrowd-dev')

  .constant('PUSHER_APP_KEY', '271ddda3dac4e0cd7e84')

  .constant('PUSHER_PRESENCE', 'presence-incrowd-dev')

  .constant('GCM_ID', 'aaa')
;

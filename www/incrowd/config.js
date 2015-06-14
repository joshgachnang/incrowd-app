angular.module('incrowd', [])

  .constant('INCROWD_EVENTS', {
    'subscribe': 'SUBSCRIPTION_SUCCEEDED',
    'chat': 'chat',
    'post': 'post',
    'comment': 'comment',
    'notification': 'notification'
  })

  .constant('ENV', 'development')

  .constant('BACKEND_SERVER', 'http://192.168.1.6:8000/api/v1/')

  .constant('GCM_ID', '445022270472') // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
;

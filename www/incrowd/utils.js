angular.module('incrowd')
  .filter('DTSince', function () {
    return function (dt) {
      if (dt == undefined) {
        return;
      }
      var now = new Date();
      var time;
      var label;
      var difference = (now - Date.parse(dt)) / 1000;
      if (difference < 60) {
        time = Math.floor(difference);
        return "a few seconds ago";
      }
      else if (difference < 3600) {
        time = Math.floor(difference / 60);
        label = time > 1 ? 'minutes' : 'minute';
      }
      else if (difference < 86400) {
        time = Math.floor(difference / 3600);
        label = time > 1 ? 'hours' : 'hour';
      }
      else if (difference < 2592000) {
        time = Math.floor(difference / 86400);
        label = time > 1 ? 'days' : 'day';
      }
      else if (difference < 77760000) {
        time = Math.floor(difference / 2592000);
        label = time > 1 ? 'months' : 'month';
      }
      else if (difference < 933120000) {
        time = Math.floor(difference / 77760000);
        label = time > 1 ? 'years' : 'year';
      }
      else if (difference < 9331200000) {
        // :) A guy can dream, right?
        // Hope there's no leap seconds..
        time = Math.floor(difference / 933120000);
        label = time > 1 ? 'decades' : 'decade';
      }
      return time + " " + label + " ago"
    }
  })


function urlify(text) {
  var expression = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

  var regex = new RegExp(expression);
  var t = 'www.google.com';
  return text.replace(regex, function (url) {
    return '<a href="' + url + '">' + url + '</a>';
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function highlight(text, highlight_text) {
  text = text.insert(text.indexOf(highlight_text) - 1, '<span class="highlight">');
  return text.insert(text.indexOf(highlight_text) + highlight_text.length, '</span>');

}

// Add insert so we can add highlights easily.
String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

function youtube_url_to_id(url) {
  console.log('converting ' + url + ' to youtube id');
  if (!url) {
    return;
  }
  var vid = url.split('v=')[1];
  if (!vid) {
    return;
  }
  var ampersandPosition = vid.indexOf('&');
  if (ampersandPosition != -1) {
    vid = vid.substring(0, ampersandPosition);
  }
  console.log('converted ' + url + ' to ' + vid);
  return vid
}

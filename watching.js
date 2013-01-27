chrome.storage.local.get("ythelper_options", function (data)
{
  // Get settings
  var localstorage = null;
  if (!data.ythelper_options) {
    // Options have not been changed yet
    localstorage = true;
  }
  else {
    localstorage = data.ythelper_options.localstorage;
  }

  var storage = null;
  if (localstorage) {
    storage = chrome.storage.local;
  }
  else {
    storage = chrome.storage.sync;
  }

  // get video id from url
  var videoId = new RegExp('v=' + '(.+?)(&|$)').exec(window.location.search)[1];

  storage.get("watched_id", function(data) {
    var ids = data.watched_id;
    if (!ids) {
      // storage does not contain "watched_id"
      ids = {};
    }
    
    if(!ids[videoId]) {
      // Save video
      ids[videoId] = true;
      storage.set({"watched_id": ids});
      // Save title
      storage.get("titles", function(data) {
        // Get or create titles list
        titles = (data.titles ? data.titles : {} );
        // Get title
        var title = $("meta[name=title]").attr("content");
        titles[videoId] = title;
        storage.set({"titles": titles});
      });
    }
  });
});

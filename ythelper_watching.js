/*
This is ythelper_watching.js
*/

/*
TODO: 
  - Keep an ID-list per user instead of one for all.
*/

var storage = chrome.storage.local; /* TODO: Set to .sync instead */
// get video id from url
var videoId = new RegExp('v=' + '(.+?)(&|$)').exec(window.location.search)[1];

storage.get("watched_id", function(data) {
  var ids = data.watched_id;
  if (!ids) {
    // storage does not contain "watched_id"
    ids = {};
  }
  
  if(!ids[videoId]) {
    // this video was not in storage
    ids[videoId] = true;
    storage.set({"watched_id": ids});
  }
});

/*
To save/load which items have been played
=========================================
Saving
------
When a youbute.com/watch?v=LkL1jwgy6Fs page is loaded the video-id can be 
extracted from the url and added to localStorage.
If not, there is an element on the page like this:
	<input type="hidden" name="video_id" value="LkL1jwgy6Fs">
which can be used to get the info.
*/
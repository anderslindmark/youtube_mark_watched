/*
This is ythelper_userpage.js
*/
var storage = chrome.storage.local; /* TODO: Set to .sync instead */
storage.get("watched_id", function(data) {
	ids = data.watched_id;
	if (!ids) { return; }

	$("span.context-data-item").each( function() {
		// get video id and set parent item style.
		var id = $(this).attr("data-context-item-id");
		if (id && ids[id]) {
			$(this).parent().attr("style", "opacity: 0.3;");
		}
	});
});

/*
To do the actual visual change
==============================
 <li class="channels-content-item"> 
 	^- these need to have the attribute id="content-item-watched" added
 css needs:
 #content-item-watched {
 	opacity: 0.5;	
 }

To save/load which items have been played
=========================================
Loading
-------
The span immediately under .channels-content-item is .context-data-item and
this span has an attribute:
	data-context-item-id="qY8slnOKFtE"
which can be read.
*/
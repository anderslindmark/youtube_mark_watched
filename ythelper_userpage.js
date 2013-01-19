defaultoptions = {
	'opacity': 0.3,
	'localstorage': true
};

chrome.storage.local.get("ythelper_options", function (data)
{
	// Get settings
	var localstorage = null;
	var opacity = null;
	if (!data.ythelper_options) {
		// Options have not been changed yet
		opacity = defaultoptions.opacity;
		localstorage = defaultoptions.localstorage;
	}
	else {
		opacity = data.ythelper_options.opacity;
		localstorage = data.ythelper_options.localstorage;
	}

	var storage = null;
	if (localstorage) {
		storage = chrome.storage.local;
	}
	else {
		storage = chrome.storage.sync;
	}

	// Load history
	storage.get("watched_id", function(data) {
		ids = data.watched_id;
		if (!ids) { return; }

		// Check every video box and see if it is in the history
		$("span.context-data-item").each( function() {
			// get video id and set parent item style.
			var id = $(this).attr("data-context-item-id");
			if (id && ids[id]) {
				$(this).parent().css("opacity", opacity);
			}
		});
	});
});

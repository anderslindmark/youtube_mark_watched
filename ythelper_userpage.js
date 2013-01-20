defaultoptions = {
	'opacity': 0.3,
	'localstorage': true,
	'effect_enabled': true
};

/*
TODO: Deal with "Load more" (http://www.youtube.com/channel_ajax?action_load_more_videos)
	A "not watched" button to undo videos that are marked as watched
*/

chrome.storage.local.get("ythelper_options", function (data)
{
	// Get settings
	var options;
	if (!data.ythelper_options) {
		// Options have not been changed yet
		options = defaultoptions;
	}
	else {
		options = data.ythelper_options;
	}
	console.log("Effects enabled: " + options.effect_enabled);
	if (options.effect_enabled) {
		var storage = null;
		if (options.localstorage) {
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
					$(this).parent().css("opacity", options.opacity);
				}
			});
		});
	}
});

defaultoptions = {
	'opacity': 0.3,
	'localstorage': true,
	'effect_enabled': true
};

/*
TODO:
	- Deal with "Load more" (http://www.youtube.com/channel_ajax?action_load_more_videos)
	- Move common stuff to a separate javascript-file and add that to the content_script chain
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
				var video_id = $(this).attr("data-context-item-id");
				if (video_id && ids[video_id]) {
					//$(this).parent().css("opacity", options.opacity);
					$(this).css("opacity", options.opacity);
					$(this).find(".content-item-detail").css("opacity", options.opacity);
					var offset = $(this).parent().offset();
					var info = $(this).parent().prepend('<div class="thumbnail_overlay" id="' + video_id + '"">' + 
						'<a href="#" class"thumbnail_overlay" id="' + video_id + '">Unwatch</a>' +
						'</div>');
					info.css("top", offset.top);
					info.css("left", offset.left);
					info.click( function(event) {
						event.preventDefault();
						unwatch(storage, ids, video_id);
					});
				}
			});
		});
	}
});

function unwatch(storage, ids, video_id) {
	delete ids[video_id];
	storage.set({"watched_id": ids}, function() {
		console.log("Unwatched " + video_id);
	});
}

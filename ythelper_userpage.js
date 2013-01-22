defaultoptions = {
	'opacity': 0.3,
	'localstorage': true,
	'effect_enabled': true
};

// Load stylesheet
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('userpage.css');
document.head.appendChild(style);

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
					setOpacity($(this), options.opacity );
					var offset = $(this).parent().offset();

					$(this).parent().prepend('<span class="thumbnail_overlay" id="' + video_id + '">' + 
						'Unwatch' +
						'</span>');
				}
			});

			$(".thumbnail_overlay").click( function() {
				var video_id = $(this).attr("id");
				unwatch(storage, ids, video_id);
				// Unset transparency
				setOpacity($(this), 1);
				// Remove "button"
				$(this).remove();
			});

		});
	}
});

function setOpacity(element, opacity) {
	// Called with any child item as element
	var base = element.parent();
	var context_data_item = base.find(".context-data-item");
	var content_item_detail = base.find(".content-item-detail");
	context_data_item.css("opacity", opacity);
	content_item_detail.css("opacity", opacity);
}

function unwatch(storage, ids, video_id) {
	delete ids[video_id];
	storage.set({"watched_id": ids}, function() {
		console.log("Unwatched " + video_id);
	});
}

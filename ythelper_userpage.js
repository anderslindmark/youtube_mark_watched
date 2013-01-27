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
		- This is currently only handled by the setInterval-loop. Which means that newly loaded items can take up to five seconds
		  to be processed. But maybe that is "good enough".
	- Move common CSS-stuff to one css-file and only keep page specific stuff in the page ones
	- Move common JS-stuff to one js-file and either <script> it or add it to the content_script chain 
	- Instead of saving "watched_id" and "titles" etcetera, save a "video_info" (or something) where 
	  the key is the id and all other fields of interest are properties.
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
		setInterval(processContentItems, 5000, options);
		processContentItems(options);
	}
});


function processContentItems(options) {
	var storage = options.localstorage ? chrome.storage.local : chrome.storage.sync;
	var ids = null;

	// Load history
	storage.get("watched_id", function(data) {
		ids = data.watched_id;
		if (!ids) { return; }
		if (!options.effect_enabled) { return; }

		// Check every video box and see if it is in the history
		$("span.context-data-item").not(".ythelper_marked_as_watched").each( function() {
			// get video id and set parent item style.
			var video_id = $(this).attr("data-context-item-id");
			// if the element has the attribute, and that attribute exists as a property in the ids, it is a watched video.
			if (video_id && ids[video_id]) {
				$(this).addClass("ythelper_marked_as_watched");
				setOpacity($(this), options.opacity );
				//var offset = $(this).parent().offset();

				$(this).parent().prepend('<span class="thumbnail_overlay" id="' + video_id + '">' + 
					'Unwatch' +
					'</span>');
			}
		});

		$(".thumbnail_overlay").click( function() {
			var video_id = $(this).attr("id");
			// Remove the class
			$(this).parent().find(".context-data-item").removeClass("ythelper_marked_as_watched");
			unwatch(storage, ids, video_id);
			// Unset transparency
			setOpacity($(this), 1);
			// Remove "button"
			$(this).remove();
		});
	}); 
}


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

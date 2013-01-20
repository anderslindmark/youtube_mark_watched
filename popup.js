defaultoptions = {
	'opacity': 0.3,
	'localstorage': true,
	'effect_enabled': true
};

// Options are always stored locally. History can be stored with sync
// Load options
chrome.storage.local.get("ythelper_options", function(data) {
	if(!data.ythelper_options) {
		// Options were not found in local either, use defaultoptions
		chrome.storage.local.set({"ythelper_options": defaultoptions}, function() {
			console.log("options created");
			loadOptions(defaultoptions);
		});
		return;
	}
	else {
		// Data found in local
		console.log("options loaded");
		loadOptions(data.ythelper_options);
	}
});

var currentOptions = null;
function loadOptions(options) {
	// Effect
	currentOptions = options;
	if (options.effect_enabled) {
		$("#effect_enabled").attr("checked", true);
	}
	else {
		$("#effect_enabled").attr("checked", false);
	}

	$("#effect_enabled").button("refresh");
}

function saveOptions() {
	// Get options from input values
	options = {
		"opacity": currentOptions.opacity,
		"localstorage": currentOptions.localstorage,
		"effect_enabled": $("#effect_enabled").is(":checked")
	}

	// Save options
	chrome.storage.local.set({"ythelper_options": options}, null);
}

$("document").ready( function() {
	$("#effect_enabled").button().click( function() {
		saveOptions();
	});
});






defaultoptions = {
	'opacity': 0.3,
	'localstorage': true
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

var startingOptions = null;
var optOpacity = null;
var optLocalStorage = null;

function loadOptions(options) {
	startingOptions = options;
	// Opacity
	$("#opacityslider").slider({"value": options.opacity});
	$("#opacityvalue").html(options.opacity);

	// Storage
	if (options.localstorage) {
		console.log("selecting local storage");
		$("#radiolocal").attr("checked", true);
		$("#radiosync").attr("checked", false);
	}
	else {
		console.log("selecting sync storage");
		$("#radiolocal").attr("checked", false);
		$("#radiosync").attr("checked", true);
	}
	$("#radiolocal").button("refresh");
	$("#radiosync").button("refresh");

	$("#saveoptions").button("disable");
}

function saveOptions() {
	options = {
		"opacity": optOpacity,
		"localstorage": optLocalStorage
	}
	// Get options from input values
	// Save options
	chrome.storage.local.set({"ythelper_options": options}, function(data) {
		// TODO: Show div with "blabla saved"
		alert("Options saved");
	});
}


$("document").ready( function() {
	$("#opacityslider").slider({
		"step": 0.05,
		"min": 0,
		"max": 1,
		"change": function(event, ui) {
			$("#opacityvalue").html(ui.value);
			optOpacity = ui.value;
			$("#saveoptions").button("enable");
		},
	});

	$("#radiostorage").buttonset();
	$("#radiostorage").change( function() {
		var method = $('input[name=radiostorage]:checked').attr("id"); // either "radiolocal" or radiosync

		switch (method) {
			case 'radiosync':
				console.log("localstorage -> false");
				optLocalStorage = false;
				break;
			case 'radiolocal':
				console.log("localstorage -> true");
				optLocalStorage = true;
				break;
		}

		$("#saveoptions").button("enable");
	});

	$("#saveoptions").button({
		"disabled": true
	}).click(function(){
		saveOptions();
	});
});






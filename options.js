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
	// Get options from input values
	options = {
		"opacity": optOpacity,
		"localstorage": optLocalStorage
	}

	// Save options
	chrome.storage.local.set({"ythelper_options": options}, function(data) {
		$("#saveoptions").button("disable");
		showMessage("Your changes have been saved!");
	});
}

function showMessage(msg) {
	$("#messagebox").html(msg);
	$("#messagebox").show();
	$("#messagebox").fadeOut(3000);
}

function deleteHistory(localstorage) {
	var storage = null;
	if (localstorage) {
		storage = chrome.storage.local;
	}
	else {
		storage = chrome.storage.sync;
	}

	storage.remove("watched_id", function() {
		var msg = ( localstorage ? "Local" : "Sync" ) + " history has been cleared.";
		showMessage(msg);
		loadHistoryInfo(localstorage);
	})
}

function loadHistoryInfo(localstorage) {
	var storage = null;
	var infoid = null;
	if (localstorage) {
		storage = chrome.storage.local;
		infoid = "#historyinfo_local";
	}
	else {
		storage = chrome.storage.sync;
		infoid = "#historyinfo_sync";
	}

	storage.get("watched_id", function(data) {
		var idcount = 0;
		if (data.watched_id) {
			idcount = Object.keys(data.watched_id).length;
		}
		var msg = "Videos in " + ( localstorage ? "local" : "sync" ) + " storage: <b>" + idcount + "</b>";
		$(infoid).html(msg);
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

	/*
	chrome.storage.local.get("watched_id", function(data) {
		var idcount = 0;
		if (data.watched_id) {
			idcount = Object.keys(data.watched_id).length;
		}
		$("#historyinfo_local").html("Videos in local storage: <b>" + idcount + "</b>");
	});

	chrome.storage.sync.get("watched_id", function(data) {
		var idcount = 0;
		if (data.watched_id) {
			idcount = Object.keys(data.watched_id).length;
		}
		$("#historyinfo_sync").html("Videos in sync-storage: <b>" + idcount + "</b>");
	});
	*/

	loadHistoryInfo(true); // Load local history
	loadHistoryInfo(false); // Load sync history

	$("#clearlocal").button().click(function() {
		deleteHistory(true);
	});
	$("#clearsync").button().click(function() {
		deleteHistory(false);
	});
});






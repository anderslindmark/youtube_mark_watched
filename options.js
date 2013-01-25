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


function loadOptions(options) {
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

	// Effect
	if (options.effect_enabled) {
		$("#effect_enabled").attr("checked", true);
	}
	else {
		$("#effect_enabled").attr("checked", false);
	}

	$("#radiolocal").button("refresh");
	$("#radiosync").button("refresh");
	$("#effect_enabled").button("refresh");

	$("#saveoptions").button("disable");
}


function saveOptions() {
	// Get options from input values
	var localstorage = null;
	switch ($('input[name=radiostorage]:checked').attr("id")) {
		case 'radiosync':
			localstorage = false;
			break;
		case 'radiolocal':
			localstorage = true;
			break;
	}

	options = {
		"opacity": $("#opacityslider").slider("option", "value"),
		"localstorage": localstorage,
		"effect_enabled": $("#effect_enabled").is(":checked")
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
			$("#saveoptions").button("enable");
		},
	});

	$("#radiostorage").buttonset();
	$("#radiostorage").change( function() {
		$("#saveoptions").button("enable");
	});

	$("#effect_enabled").button().click( function() {
		$("#saveoptions").button("enable");
	});

	$("#saveoptions").button({
		"disabled": true
	}).click(function(){
		saveOptions();
	});

	loadHistoryInfo(true); // Load local history
	loadHistoryInfo(false); // Load sync history

	$("#clearlocal").button().click(function() {
		deleteHistory(true);
	});
	$("#clearsync").button().click(function() {
		deleteHistory(false);
	});

	$("#showhistlocal").button().click(function() {
		window.location = chrome.extension.getURL("history.html?storageArea=local");
	});

	$("#showhistsync").button().click(function() {
		window.location = chrome.extension.getURL("history.html?storageArea=sync");
	});
	

	$("a#historyinfo_showhistory_link").attr("href", chrome.extension.getURL("history.html"));
});






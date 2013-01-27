function getQueryParams(qs) {
	// This function is taken from: http://stackoverflow.com/a/439578
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}



$("document").ready( function() {
	var $_GET = getQueryParams(document.location.search);
	var storageType = $_GET["storageArea"];

	if (storageType == "local") {
		$("#historytitle").html("Local video history");
	}
	else {
		$("#historytitle").html("Sync video history");
	}
	


	var localstorage = storageType == "local";

	var storage = (localstorage ? chrome.storage.local : chrome.storage.sync);

	// Load videos
	storage.get("watched_id", function(dataIds) {
		storage.get("titles", function(dataTitles) {
			ids = dataIds.watched_id;
			if (!ids) {
				$("#emptyhist").show();
				return;
			}
			$("#historylist").show();
			$("tr:even").css("background", "#c0c0c0;");

			titles = dataTitles.titles;
			if (!titles) {
				console.log("No titles!");
				return;
			}

			for (video_id in ids) {
				/*
				var tbody = $("#historylist").find("tbody");
				var row = tbody.append($('<tr id="trow">'));

				row.append($('<td>asd</td>'));
				*/

				var pId 	= '<p class="video_id">' + 
					'<a href="http://www.youtube.com/watch?v=' + video_id  + '">' +
					video_id +
					'</p>';
				var pTitle 	= '<p class="video_title">' + titles[video_id] + '</p>';
				var pOps 	= '<p>Delete</p>';

				$("#historylist").find('tbody').append($('<tr>')
        			.append($('<td>')
            			.append($(pId))
        			)
        			.append($('<td>')
        				.append($(pTitle))
        			)
        			.append($(pOps))
        			/*
        			.append($('<td>')
        				.append($('<img>')
        					.attr('src', 'img2.png')
        					.text('Image cell 2')
        				)
        			)
					*/
    			);
			}

			$("#historylist tr:odd").css("background-color", "#F6F6F6;");
		});
	});
});

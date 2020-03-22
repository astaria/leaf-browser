function feed_explore(keyword, location, length, sortkey, sortorder, handler) {
    var url = "https://leafapp.io/api/v1/channel/" + $data["channel"]

    if (location == 0) {
        fetch(url, null, true).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    handler(data)
                })
            } else {
                handler([])
            }
        })	
    } else {
        handler([])
    }
}

function select_app(data) {
	controller.action("app", {
		"app":data["app"],
		"version":data["version"],
		"url":data["file"]
	})
}

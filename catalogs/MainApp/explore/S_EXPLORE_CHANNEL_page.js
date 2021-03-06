function feed_explore(keyword, location, length, sortkey, sortorder, handler) {
//    var url = "https://leafapp.io/api/v1/channel/" + $data["channel"]
    var url = "https://jampod-156205.appspot.com/api/v1/channel/" + $data["channel"]
    var options = { "includes-session-headers":true }

    if (location == 0) {
        fetch(url, null, options).then(function(response) {
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

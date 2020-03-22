function feed_explore(keyword, location, length, sortkey, sortorder, handler) {
    var url = "https://leafapp.io/api/v1/store"
    var query = "location=" + location + "&" + "length=" + length
    var cached = __cached_data()

    if (cached.length > location) {
        timeout(1.5, function() {
    	    var last = location + Math.min(cached.length - location, length)

            if (last > location) {
                handler(cached.slice(location, last))
            } else {
                handler([])
            }
        })
    } else {
        fetch(url + "?" + query, null, true).then(function(response) {
           	if (response.ok) {
               	response.json().then(function(data) {
              		handler(data)

                   	__cache_data(cached.concat(data))
               	})
           	} else {
               	handler([])
           	}
       	})	
    }
}

function reset_explore() {
    var data = document.value("data.explore")
    
    if (data) {
        document.value("data.explore.at", Date.now() - 3600 * 1000)
    }
}

function open_app(data) {
    controller.action("app", {
        "app":data["app"],
        "version":data["version"],
        "url":data["file"]
    })
}

function __cached_data() {
    var data = document.value("data.explore")
    
    if (data) {
        var interval = Date.now() - document.value("data.explore.at")
        
        if (interval < 3600 * 1000) { /* 1 hour */
            return data
        }
    }
    
    return []
}

function __cache_data(data) {
    document.value("data.explore", data)
    document.value("data.explore.at", Date.now())
}

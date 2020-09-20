function feed_explore(keyword, location, length, sortkey, sortorder, handler) {
    //var url = "https://leafapp.io/api/v1/store"
    var url = "https://jampod-156205.appspot.com/api/v1/store"
    var query = "location=" + location + "&" + "length=" + length
    var options = { "includes-session-headers":true }
    var cached = _cached_data()

    console.log(device("country"))

    if (cached.length > location) {
        var last = location + Math.min(cached.length - location, length)

        if (last > location) {
           handler(cached.slice(location, last))
        } else {
           handler([])
        }
    } else {
        fetch(url + "?" + query, null, options).then(function(response) {
           	if (response.ok) {
               	response.json().then(function(data) {
              		handler(data)

                   	_cache_data(cached.concat(data))
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

function open_app(params) {
    controller.action("app", {
        "app":params["app"],
        "version":params["version"],
        "url":params["file"]
    })
}

function _cached_data() {
    var data = document.value("data.explore")
    
    if (data) {
        var interval = Date.now() - document.value("data.explore.at")
        
        if (interval < 3600 * 1000) { /* 1 hour */
            return data
        }
    }
    
    return []
}

function _cache_data(data) {
    document.value("data.explore", data)
    document.value("data.explore.at", Date.now())
}

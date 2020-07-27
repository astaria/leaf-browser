Apps = (function() {
    return {}
})()

Apps.open_app = function(app_id, url, params) {
    controller.action("app", { 
        "app":app_id, 
        "url":Apps.__get_app_url(url),
        "version":params["version"] || "0.0",
        "open-url":params["open-url"] || "",
        "app-params":params["app-params"] || ""
    })
}

Apps.__get_app_url = function(url) {
    var github = /github:\/\/([^/]+)\/([^/]+)/.exec(url)

    if (github) {
        return "https://github.com/" + github[1] + "/" + github[2] + "/archive/master.zip"
    }

    var ipfs = /ipfs:\/\/hash\/([^/]+)/.exec(url)

    if (ipfs) {
        return "https://ipfs.infura.io/ipfs/" + ipfs[1]
    }

    return url
}

Apps.__to_action_params = function(params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + params[k];
    }).join(',')
}

__MODULE__ = Apps

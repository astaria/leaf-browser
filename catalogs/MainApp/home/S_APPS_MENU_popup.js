function remove() {
    controller.action("remove", {
        "display-unit":$data["package"],
        "target":"object",
        "object":$data["source"],
        "action-when-done":"popup-close"
    })
}

function pin() {
    controller.action("pin", {
        "display-unit":$data["package"],
        "target":"object",
        "object":$data["source"],
        "action-when-done":"popup-close"
    })
}

function unpin() {
    controller.action("unpin", {
        "display-unit":$data["package"],
        "target":"object",
        "object":$data["source"],
        "action-when-done":"popup-close"
    })
}

function channel() {
    controller.catalog().submit("showcase", "auxiliary", "S_APPS_CHANNEL", {
        "channel":$data["channel"],
        "title":$data["title"] || "",
        "track-code":$data["channel"]
    })
    controller.action("page", { 
        "display-unit":"S_APPS_CHANNEL",
        "close-popup":"yes" 
    })
}

function shortcut() {
    controller.action("shortcut", {
        "app":$data["app"],
        "action-when-done":"popup-close"
    })
}

function share() {
    controller.action("freeze", {
        "message":controller.catalog().string("Preparing...")
    })
    
    _fetch_app_info().then(function(data) {
        _share_app_url(data["file"])

        timeout(1, function() {
            controller.action("unfreeze", { "close-popup":"yes" })
        })
    }, function(error) {
        controller.action("export", {
            "target":"app",
            "app":$data["app"],
            "filename":"__SHARE__.jam",
            "root-path":"cache",
            "freezes":"no",
            "script-when-done":"on_export_to_share"
        })    
    })
}

function on_export_to_share() {
    controller.action("freeze", {
        "message":controller.catalog().string("Generating...")
    })
    
    exist('cache', '__SHARE__.jam').then(function(path) {
        _publish_app_to_ipfs(path).then(function(hash) {
            _share_app_url("ipfs://hash/" + hash)

            timeout(1, function() {
                controller.action("unfreeze", { "close-popup":"yes" })
            })
        }, function(error) {
            controller.action("unfreeze")
            controller.action("toast", {
                "message":controller.catalog().string("Failed to connect to server for sharing.")
            })
        })
    })
}

function _fetch_app_info() {
    return new Promise(function(resolve, reject) {
        var url = "https://leafapp.io/api/v1/apps/" + $data["app"]

        fetch(url).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    resolve(data)
                }, function(error) {
                    reject(error)
                })
            } else {
                reject(response.status)
            }
        })
    })
}

function _publish_app_to_ipfs(path) {
    return new Promise(function(resolve, reject) {
        var ipfs = require("ipfs-gateway")
        var addr = '/dnsaddr/ipfs.infura.io/tcp/5001/https'

        ipfs.bind(addr).then(function() {
            ipfs.add(path).then(function(hash) {
                resolve(hash)
            }, function(error) {
                reject(error)
            })
        }, function(error) {
            reject(error)
        })
    })
}

function _share_app_url(url) {
    var url_to_share = "https://leafapp.io/connect/app?" +
                       "app=" + $data["app"] + "&" + 
                       "title=" + encodeURIComponent($data["title"]) + "&" + 
                       "url=" + encodeURIComponent(url)

    controller.action("share", { "url":url_to_share })
}

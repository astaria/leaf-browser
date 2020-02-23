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
    controller.catalog().submit("showcase", "auxiliary", "S_APPS.CHANNEL", {
        "channel":$data["channel"],
        "title":$data["title"] || ""
    });
    controller.action("page", { 
        "display-unit":"S_APPS.CHANNEL",
        "close-popup":"yes" 
    });
}

function share() {
    controller.action("export", {
        "target":"app",
        "app":$data["app"],
        "filename":"__app_to_share.jam",
        "root-path":"cache",
        "script-when-done":"on_export_to_share"
    })
}

function on_export_to_share() {
    exist('cache', '__app_to_share.jam').then(function(path) {
        var ipfs = require("ipfs-gateway")
        var addr = '/dnsaddr/ipfs.infura.io/tcp/5001/https'

        controller.action("freeze", {
            "message":controller.catalog().string("Generating...")
        })

        ipfs.bind(addr).then(function() {
            ipfs.add(path).then(function(hash) {
                var url_to_share = "https://leafapp.io/connect/app?" +
                                   "app=" + $data["app"] + "&" + 
                                   "title=" + encodeURIComponent($data["title"]) + "&" + 
                                   "url=" + encodeURIComponent("ipfs://hash/" + hash)
            
                controller.action("share", { "url":url_to_share })
                timeout(1, function() {
                    controller.action("unfreeze", { "close-popup":"yes" })
                })
            }, function() {
                controller.action("unfreeze")
                controller.action("toast", {
                    "message":controller.catalog().string("Failed to connect to server for sharing.")
                })    
            })
        }, function() {
            controller.action("unfreeze")
            controller.action("toast", {
                "message":controller.catalog().string("Failed to connect to server for sharing.")
            })
        })
    })
}

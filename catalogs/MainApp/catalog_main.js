const connect = require("connect")

var __media_mounted = false
var __media_bad_removed = false

var __in_foreground = false

function on_loaded() {
    if (!document.value("app.path")) {
        timeout(0.3, function() {
            __watch_and_run_app()
        })
    } else {
        __update_leaflet_status("closed")
    }

    __in_foreground = true
}

function on_foreground() {
    timeout(0.3, function() {
        __watch_and_run_app()
    })

    __in_foreground = true
}

function on_background() {
    __in_foreground = false
}

function on_receive(params) {
    if (params["action"] === "media-mounted") {
        var path = params["data"].replace("file://", "")

        if (!(document.value("app.path") || "").startsWith(path)) {
            document.value("app.path", "")
        }

        if (__in_foreground) {
            __watch_and_run_app()
        }

        __media_mounted = true
        __media_bad_removed = false

        return
    }
 
    if (params["action"] === "media-eject") {
        var path = params["data"].replace("file://", "")

        if ((document.value("app.path") || "").startsWith(path)) {
            controller.action("app-close")

            timeout(1, function() {
                __watch_and_cleanup_app()
            })

            __update_leaflet_status("bad-removal")
        }

        return
    }

    if (params["action"] === "media-unmounted") {
        var path = params["data"].replace("file://", "")

        timeout(1, function() {
            if (!__media_bad_removed) {
                __update_leaflet_status("unmounted")
            }    
        })

        __media_mounted = false

        return
    }

    if (params["action"] === "media-bad-removal") {
        __media_bad_removed = true

        return
    }
}

function on_link(params) {
    if (params["host"] === "connect" && params["path"]) {
        connect.invoke(/^\/([^/]+)/.exec(params["path"])[1], params)
    }
}

function on_connect(params) {
    connect.invoke(params["method"], params)
}

function on_notify(params) {
    
}

function on_open_app(params) {
    var url = "https://leafapp.io/api/v1/apps/" + params["app"]

    fetch(url).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (data["version"] !== params["version"]) {
                    controller.action("update", {
                        "filename":data["app"] + ".jam",
                        "root-path":"cache",
                        "dir-path":"apps",
                        "format":"jam",
                        "url":data["file"]
                    })
                }
            })
        }
    })
}

function open_app(params) {
    var data = JSON.parse(params["data"] || "{}")

    if (data["action"]) {
        controller.action(data["action"], Object.assign(data, {
            "app":params["app"],
            "routes-to-app":"yes"
        }))
    } else {
        connect.invoke("app", params)
    }
}

function open_app_again() {
    document.value("app.path", "")

    if (__in_foreground) {
        __watch_and_run_app()
    }

    console.log("run_app_again!!!")
}

function __watch_and_run_app() {
    var storages = directory("removable-storage") || []

    storages.forEach(function(path) {
        path = path + "/App"

        exist("/", path + "/package.bon").then(function() {
            if (!document.value("app.path")) {
                controller.action("open", {
                    "root-path":"/",
                    "filename":path,
                    "format":"jam"
                })
            
                __update_leaflet_status("opened")

                document.value("app.path", path)
            }
        })
    })
}

function __watch_and_cleanup_app() {
    var storages = directory("removable-storage") || []
    var exists_app_path = false

    storages.forEach(function(path) {
        path = path + "/App"

        if (path === document.value("app.path")) {
            exists_app_path = true
        }
    })

    if (exists_app_path && !__media_mounted) {
        timeout(1, function() {
            __watch_and_cleanup_app()
        })
    } else {
        document.value("app.path", "")
    }
}

function __update_leaflet_status(event) {
    controller.update("leaflet-status", { "event":event })
}

const connect  = require("connect"),
      firebase = require("firebase"),
      leaflet  = require("leaflet"),
      api      = require("api")

function on_loaded() {
    _update_deferred_apps_status()

    leaflet.on_foreground()
}

function on_foreground() {
    leaflet.on_foreground()
}

function on_background() {
    leaflet.on_background()
}

function on_register_notifications(params) {
    _update_device_token(params["device-token"])
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
    // TBD
}

function on_receive(params) {
    if (params["action"] === "media-mounted") {
        leaflet.on_media_mounted(params["data"].replace("file://", ""))

        return
    }

    if (params["action"] === "media-eject") {
        leaflet.on_media_eject(params["data"].replace("file://", ""))

        return
    }

    if (params["action"] === "media-unmounted") {
        leaflet.on_media_unmounted(params["data"].replace("file://", ""))

        return
    }

    if (params["action"] === "media-bad-removal") {
        leaflet.on_media_bad_removal(params["data"].replace("file://", ""))

        return
    }
}

function on_install_app(params) {
    firebase.activate_app(params).then(function(response) {
        controller.catalog().remove("collection", "firebase.apps", params["app"])
    }, function(error) {
        controller.catalog().submit("collection", "firebase.apps", params["app"], Object.assign(params, {
            "status":"activated"
        }))
    })
}

function on_uninstall_app(params) {
    firebase.deactivate_app(params).then(function(response) {
        controller.catalog().remove("collection", "firebase.apps", params["app"])
    }, function(error) {
        controller.catalog().submit("collection", "firebase.apps", params["app"], Object.assign(params, {
            "status":"deactivated"
        }))
    })
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

    leaflet.on_open_app(params)
}

function on_close_app(params) {
    leaflet.on_close_app(params)
}

function open_app_again() {
    leaflet.open_app_again()
}

function _update_deferred_apps_status() {
    var count = controller.catalog().count("collection", "firebase.apps")
    var apps = controller.catalog().values("collection", "firebase.apps", null, null, [ 0, count ])

    apps.forEach(function(app) {
        if (app["status"] === "activated") {
            firebase.activate_app(app).then(function(response) {
                controller.catalog().remove("collection", "firebase.apps", app["app"])
            })
        } else {
            firebase.deactivate_app(app).then(function(response) {
                controller.catalog().remove("collection", "firebase.apps", app["app"])
            })
        }
    })
}

function _update_device_token(device_token) {
    var last_device_token = storage.value("device.token")

    if (device_token !== last_device_token) {
        firebase.update_device_token(device_token).then(function(response) {
            storage.value("device.token", device_token)
        })
    }
}

var _camera_started = false
var _camera_suspended = false

function on_activate() {
    timeout(0.1, function() {
        if (!_camera_suspended) {
            view.object("camera").action("start")

            _camera_started = true
        }
    })
}

function on_suspend() {
    _camera_suspended = true
}

function on_resume() {
    if (!_camera_started) {
        view.object("camera").action("start")

        _camera_started = true
    }

    _camera_suspended = false
}

function on_scan(data) {
    var code = _get_matched_code(data["text"])

    console.log("code: " + JSON.stringify(code))

    if (code["shows-popup"] === "yes") {
        controller.catalog().submit("showcase", "auxiliary", "S_CODE.SCANNED", {
            "type":code["type"],
            "text":data["text"],
            "country-code":data["country-code"],
            "action-message":code["action-message"],
            "script":code["script"],
            "track-code":code["type"]
        })
        controller.action("popup", { "display-unit":"S_CODE.SCANNED" })        
    } else {
        eval(code["script"] + "('" + data["text"].replace("'", "\\'") + "')")
    }

    _save_scanning_history(data["text"], code)
}

function _get_matched_code(text) {
    var count = controller.catalog().count("showcase", "codes")
    var values = controller.catalog().values("showcase", "codes", null, null, [0, count])

    for (var i = 0; i < values.length; i++) {
        if (text.match(new RegExp(values[i]["pattern"]))) {
            return values[i]
        }
    }
}

function _save_scanning_history(text, code) {
    var id = encode("hex", hash("md5", text))

    controller.catalog().remove("collection", "scanning.history", id)
    controller.catalog().submit("collection", "scanning.history", id, Object.assign(code, {
        "text":text
    }))
}

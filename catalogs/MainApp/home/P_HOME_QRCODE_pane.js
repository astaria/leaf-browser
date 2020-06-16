var __camera_started = false
var __camera_suspended = false

function on_activate() {
    timeout(0.1, function() {
        if (!__camera_suspended) {
            view.object("camera").action("start")

            __camera_started = true
        }
    })
}

function on_suspend() {
    __camera_suspended = true
}

function on_resume() {
    if (!__camera_started) {
        view.object("camera").action("start")

        __camera_started = true
    }

    __camera_suspended = false
}

function on_scan(data) {
    var code = __get_matched_code(data["text"])

    console.log("code: " + JSON.stringify(code))

    if (code["shows-popup"] === "yes") {
        controller.catalog().submit("showcase", "auxiliary", "S_CODE.SCANNED", {
            "type":code["type"],
            "text":data["text"],
            "action-message":code["action-message"],
            "script":code["script"]
        })
        controller.action("popup", { "display-unit":"S_CODE.SCANNED" })        
    } else {
        eval(code["script"] + "('" + data["text"].replace("'", "\\'") + "')")
    }

    __save_scanning_history(data["text"], code)
}

function __get_matched_code(text) {
    var count = controller.catalog().count("showcase", "codes")
    var values = controller.catalog().values("showcase", "codes", null, null, [0, count])

    for (var i = 0; i < values.length; i++) {
        if (text.match(new RegExp(values[i]["pattern"]))) {
            return values[i]
        }
    }
}

function __save_scanning_history(text, code) {
    var id = encode("hex", hash("md5", text))

    controller.catalog().remove("collection", "scanning.history", id)
    controller.catalog().submit("collection", "scanning.history", id, Object.assign(code, {
        "text":text
    }))
}

function do_action() {
    eval($data["script"] + "(" +
        "'" + $data["text"].replace("'", "\\'") + "', " + 
        "'" + $data["country-code"] + "'" + 
    ")")
}

function share() {
    controller.action("share", { "text":$data["text"] })
}

function connect_with_url(text) {
    var url = parse("url", text)
    var params = Object.assign(url.params(url.query) || {}, {
        "host":"connect",
        "path":url.path.replace("/connect", "")
    })

    controller.action("script", Object.assign(params, {
        "script":"on_link",
        "subview":"__MAIN__",
        "routes-to-topmost":"no"
    }))
}

function go_to_website(text) {
    controller.action("link", {
        "url":text,
        "target":"embedded"
    })
}

function copy_to_clipboard(text) {
    controller.action("copy", {
        "text":text,
        "target":"clipboard"
    })
}

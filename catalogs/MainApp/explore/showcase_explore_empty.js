function on_loaded() {
    timeout(0.1, function() {
        view.object("effect.loading").action("show")
    })
}

function on_unloaded() {
    controller.action("toast", { "message":"on_unloaded" })
}
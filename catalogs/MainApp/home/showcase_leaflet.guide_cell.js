function on_timeout() {
    owner.property({ "display-unit":$data["next-on-timeout"] })
    owner.action("reload")
}

function do_action_1() {
    if ($data["id"] === "S_LEAFLET_INTRO") {
        controller.action("page", { "display-unit":"S_WHAT_IS_LEAFLET" })

        timeout(0.5, function() {
            owner.action("hide")
        })

        return
    }

    if ($data["id"] === "S_LEAFLET_READY") {
        owner.action("hide")

        return
    }

    if ($data["id"] === "S_LEAFLET_CLOSED") {
        controller.action("intent", { "intent":"memory-card-settings" })

        return
    }
}

function do_action_2() {
    if ($data["id"] === "S_LEAFLET_CLOSED") {
        controller.action("script", { "script":"open_app_again", "subview":"__MAIN__" })

        return
    }
}

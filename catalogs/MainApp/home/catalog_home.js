function on_change_data(id, data) {
    if (id === "leaflet-status") {
        _on_change_leaflet_status(data)

        return
    }
}

function _on_change_leaflet_status(data) {
    if (data["event"] === "opened") {
        _update_leaflet_guide("S_LEAFLET_RUNNING")
        _show_leaflet_guide()

        return
    }

    if (data["event"] === "closed") {
        _update_leaflet_guide("S_LEAFLET_CLOSED")
        _show_leaflet_guide()

        return
    }

    if (data["event"] === "unmounted") {
        _update_leaflet_guide("S_LEAFLET_INTRO")
        _hide_leaflet_guide()

        return
    }

    if (data["event"] === "bad-removal") {
        _update_leaflet_guide("S_LEAFLET_BAD_REMOVAL")
        _show_leaflet_guide()

        return
    }
}

function _update_leaflet_guide(id) {
    view.object("leaflet.guide").property({ "display-unit":id })
    view.object("leaflet.guide").action("reload")
}

function _show_leaflet_guide() {
    view.object("leaflet.guide").action("show")
}

function _hide_leaflet_guide() {
    view.object("leaflet.guide").action("hide")
}

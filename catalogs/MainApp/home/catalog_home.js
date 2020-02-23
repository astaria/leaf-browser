function on_change_data(id, data) {
    if (id === "leaflet-status") {
        __on_change_leaflet_status(data);

        return;
    }
}

function __on_change_leaflet_status(data) {
    if (data["event"] === "opened") {
        __submit_leaflet_status({ "leaflet-used":"yes" });

        __update_leaflet_guide("S_LEAFLET_RUNNING");
        __show_leaflet_guide();

        return;
    }

    if (data["event"] === "closed") {
        __update_leaflet_guide("S_LEAFLET_CLOSED");
        __show_leaflet_guide();

        return;
    }

    if (data["event"] === "unmounted") {
        __update_leaflet_guide("S_LEAFLET_INTRO");
        __hide_leaflet_guide();

        return;
    }

    if (data["event"] === "bad-removal") {
        __update_leaflet_guide("S_LEAFLET_BAD_REMOVAL");
        __show_leaflet_guide();

        return;
    }
}

function __submit_leaflet_status(data) {
    var status = controller.catalog().value("showcase", "leaflet", "S_LEAFLET_STATUS");

    if (data) {
        status = Object.assign(status, data);
    }

    controller.catalog().submit("showcase", "leaflet", "S_LEAFLET_STATUS", status);
}

function __update_leaflet_guide(id) {
    view.object("leaflet.guide").property({ "display-unit":id });
    view.object("leaflet.guide").action("reload");
}

function __show_leaflet_guide() {
    view.object("leaflet.guide").action("show");
}

function __hide_leaflet_guide() {
    view.object("leaflet.guide").action("hide");
}

function explore_channel() {
    controller.catalog().submit("showcase", "auxiliary", "S_EXPLORE.CHANNEL", {
        "channel":$data["channel"],
        "title":$data["channel-title"] || ""
    })
    controller.action("page", { "display-unit":"S_EXPLORE.CHANNEL" })
}

function show_menu() {
    controller.catalog().submit("showcase", "auxiliary", "S_EXPLORE.MENU", {
        "package":$data["id"],
        "title":$data["title"]
    })
    controller.action("popup", { "display-unit":"S_EXPLORE.MENU" })
}

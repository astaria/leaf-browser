function explore_channel() {
    controller.catalog().submit("showcase", "auxiliary", "S_EXPLORE_CHANNEL", {
        "channel":$data["channel"],
        "title":$data["channel-title"] || ""
    })
    controller.action("page", { "display-unit":"S_EXPLORE_CHANNEL" })
}

function show_menu() {
    controller.catalog().submit("showcase", "auxiliary", "S_EXPLORE_MENU", {
        "package":$data["id"],
        "title":$data["title"]
    })
    controller.action("popup", { "display-unit":"S_EXPLORE_MENU" })
}

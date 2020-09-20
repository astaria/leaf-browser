include("showcase_apps_cell.js")

function open_channel() {
    controller.catalog().submit("showcase", "auxiliary", "S_APPS_CHANNEL", {
        "channel":$data["channel"],
        "title":$data["title"] || "",
        "track-code":$data["channel"]
    })
    controller.action("page", { "display-unit":"S_APPS_CHANNEL" })
}

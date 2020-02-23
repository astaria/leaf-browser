include("showcase_apps_cell.js");

function open_channel() {
    controller.catalog().submit("showcase", "auxiliary", "S_APPS.CHANNEL", {
        "channel":$data["channel"],
        "title":$data["title"] || ""
    });
    controller.action("page", { "display-unit":"S_APPS.CHANNEL" });
}

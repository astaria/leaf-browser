function show_menu() {
    var source = ($env["APPEARANCE"] == "header") ? "showcase.apps.header" : "showcase.apps"

    controller.catalog().submit("showcase", "auxiliary", "S_APPS_MENU", {
        "package":$data["id"],
        "title":$data["title"],
        "channel":$data["channel"] || "",
        "app":$data["app"] || "",
        "pinning":$data["pinning"],
        "source":source
    })
    controller.action("popup", { "display-unit":"S_APPS_MENU" })
}

API = (function() {
    return {};
})();

API.get_billing_contact = function(params) {
    API.__invoke(params, "SHOPPING", function() {

    })
}

API.get_shipping_addresses = function(params) {
    API.__invoke(params, "SHOPPING", function() {

    })
}

API.__invoke = function(params, permission, handler) {
    if (params["source-app"] && !API.__is_authorized(params["source-app"], permission)) {
        API.__authorize_app(params["source-app"], permission, function() {
            handler()          
        })
    } else {
        handler()
    }
}

API.__authorize_app = function(app_id, permission, handler) {
    var app_info = controller.data("app", app_id)
    var request_id = new Date().toISOString().replace(/[.:\-]/g, "").toLowerCase()

    controller.catalog().submit("showcase", "auxiliary", "S_AUTHORIZE_APP", {
        "app-id":app_info["id"],
        "language":app_info["language"],
        "version":app_info["version"],
        "title":app_info["title"] || "",
        "description":app_info["description"] || "",
        "owner":app_info["owner"] || "",
        "request-id":request_id,
        "return-script":"API.__on_authorize_app",
        "return-subview":$data["SUBVIEW"] || "__MAIN__"
    })

    API.__handlers[request_id] = handler

    controller.action("subview", { "subview":"V_AUTHORIZE_APP", "target":"popup" })
}

API.__on_authorize_app = function(params) {
   var handler = API.__handlers[params["request-id"] || ""]

    if (handler) {
        handler(params)
    }

    delete API.__handlers["request-id"]
}

API.__is_authorized = function(app_id, permission) {
    var value = controller.catalog().value("collection", "authorized.apps", "C_AUTHORIZED.APPS_" + app_id)

    if (value) {
        return true
    }

    return false
}

API.__invoke_params = function(params) {
    return {
        "return-script":params["return-script"] || "",
        "return-subview":params["return-subview"] || "",
        "request-id":params["request-id"] || "",
        "source-app":params["source-app"] || ""
    }
}

__MODULE__ = API;

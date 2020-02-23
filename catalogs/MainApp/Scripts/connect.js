Connect = (function() {
    return {
        __handlers:{}
    };
})();

Connect.apps  = require("apps");
Connect.books = require("books");

Connect.invoke = function(method, params) {
    if (params["source-app"] && !Connect.apps.is_authorized(params["source-app"])) {
        if (!Connect.__is_free_method(method) && $env["SIMULATOR"] !== "yes") {
            Connect.__authorize_app(params["source-app"], function() {
                if (Connect.hasOwnProperty("__invoke_" + method)) {
                    Connect["__invoke_" + method](params);
                }                
            });
        } else {
            if (Connect.hasOwnProperty("__invoke_" + method)) {
                Connect["__invoke_" + method](params);
            }
        }
    } else {
        if (Connect.hasOwnProperty("__invoke_" + method)) {
            Connect["__invoke_" + method](params);
        }
    }
}

Connect.__authorize_app = function(app_id, handler) {
    var app_info = controller.data("app", app_id);
    var request_id = new Date().toISOString().replace(/[.:\-]/g, "").toLowerCase();

    controller.catalog().submit("showcase", "auxiliary", "S_AUTHORIZE_APP", {
        "app-id":app_info["id"],
        "language":app_info["language"],
        "version":app_info["version"],
        "title":app_info["title"] || "",
        "description":app_info["description"] || "",
        "owner":app_info["owner"] || "",
        "request-id":request_id,
        "return-script":"Connect.__on_authorize_app",
        "return-subview":$data["SUBVIEW"] || "__MAIN__"
    });

    Connect.__handlers[request_id] = handler;

    controller.action("subview", { "subview":"V_AUTHORIZE_APP", "target":"popup" });
}

Connect.__on_authorize_app = function(params) {
   var handler = Connect.__handlers[params["request-id"] || ""];

    if (handler) {
        handler(params);
    }

    delete Connect.__handlers["request-id"];
}

Connect.__invoke_app = function(params) {
    Connect.apps.open_app(params["app"], params["url"], params["version"]);
}

Connect.__invoke_book = function(params) {
    Connect.books.open_book(params["book"], params["url"]);
}

Connect.__is_free_method = function(method) {
    var free_methods = [ 
    ];

    if (free_methods.includes(method)) {
        return true;
    }

    return false;
}

Connect.__invoke_params = function(params) {
    return {
        "return-script":params["return-script"] || "",
        "return-subview":params["return-subview"] || "",
        "request-id":params["request-id"] || "",
        "source-app":params["source-app"] || ""
    }
}

__MODULE__ = Connect;

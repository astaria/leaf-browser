Apps = (function() {
    return {};
})();

Apps.open_app = function(app_id, url, version) {
    controller.action("app", { 
        "app":app_id, 
        "url":Apps.__get_app_url(url),
        "version":version || "0.0"
    });
}

Apps.authorize_app = function(app_id) {
    var app_info = controller.data("app", app_id);

    controller.catalog().submit("collection", "authorized.apps", "C_AUTHORIZED.APPS_" + app_id, {
        "app-id":app_info["id"],
        "version":app_info["version"] || "1.0",
        "title":app_info["title"] || "",
        "owner":app_info["owner"] || "",
    });
}

Apps.is_authorized = function(app_id) {
    var value = controller.catalog().value("collection", "authorized.apps", "C_AUTHORIZED.APPS_" + app_id);

    if (value) {
        return true;
    }

    return false;
}

Apps.get_authorized_apps = function(location, length) {
    var values = controller.catalog().values("collection", "authorized.apps", null, null, [ location, length ])
    var apps = [];

    values.forEach(function(value) {
        apps.push(value);
    });

    return apps;
}

Apps.__get_app_url = function(url) {
    var github = /github:\/\/([^/]+)\/([^/]+)/.exec(url);

    if (github) {
        return "https://github.com/" + github[1] + "/" + github[2] + "/archive/master.zip";
    }

    var ipfs = /ipfs:\/\/hash\/([^/]+)/.exec(url);

    if (ipfs) {
        return "https://ipfs.infura.io/ipfs/" + ipfs[1];
    }

    return url;
}

Apps.__to_action_params = function(params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + params[k];
    }).join(',')
}

__MODULE__ = Apps;

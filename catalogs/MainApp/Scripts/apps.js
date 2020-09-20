var module = (function() {
    function _get_app_url(url) {
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

    return {
        open_app: function(app_id, url, params) {
            controller.action("app", { 
                "app":app_id, 
                "url":_get_app_url(url),
                "version":params["version"] || "0.0",
                "open-url":params["open-url"] || "",
                "app-params":params["app-params"] || ""
            })
        },
    }
})();

__MODULE__ = module;

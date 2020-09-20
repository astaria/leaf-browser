var module = (function() {
    var _in_foreground = false;

    function _watch_and_run_app(storage_dir) {
        var storage_dirs = storage_dir ? [ storage_dir ] : directory("removable-storage");

        _find_app_paths(storage_dirs || [], function(app_paths) {
            if (app_paths.length > 0) {
                var [ storage_dir, app_path ] = app_paths[0]

                controller.action("open", {
                    "root-path":"/",
                    "filename":app_path,
                    "format":"jam"
                });
                
                document.value("leaflet.storage-dir", storage_dir);
                document.value("leaflet.media-badly-removed", false);
                document.value("leaflet.app-running", true);
                document.value("leaflet.app-force-closed", false);
       
                _update_leaflet_status("opened");
            }
        })
    }

    function _find_app_paths(storage_dirs, handler) {
        var app_paths = [], scanned_storages_count = 0;

        storage_dirs.forEach(function(storage_dir) {
            var app_path = storage_dir.substring(1) + "/App";
        
            exist("/", app_path + "/package.bon").then(function() {
                app_paths.push([ storage_dir, app_path ]);
                
                if (++scanned_storages_count === storage_dirs.length) {
                    handler(app_paths)
                }
            }, function() {
                if (++scanned_storages_count === storage_dirs.length) {
                    handler(app_paths)
                }
            }) 
        })
    }

    function _find_storage_dir(media_dir) {
        var storage_dirs = directory("removable-storage") || [];

        for (var i = 0; i < storage_dirs.length; ++i) {
            if (storage_dirs[i].startsWith(media_dir)) {
                return storage_dirs[i];
            }
        }
    }

    function _update_leaflet_status(event) {
        controller.update("leaflet-status", {
            "event":event
        });
    }

    return {
        on_foreground: function() {
            if (!document.value("leaflet.storage-dir")) {
                timeout(0.3, function() {
                    _watch_and_run_app();
                })
            }

            _in_foreground = true;
        },

        on_background: function() {
            _in_foreground = false;
        },

        on_media_mounted: function(media_dir) {
            var storage_dir = _find_storage_dir(media_dir);

            if (_in_foreground) {
                _watch_and_run_app(storage_dir);
            }
        },

        on_media_eject: function(media_dir) {
            var storage_dir = _find_storage_dir(media_dir);

            if (storage_dir === document.value("leaflet.storage-dir")) {
                if (document.value("leaflet.app-running")) {
                    controller.action("app-close");

                    document.value("leaflet.app-force-closed", true);
                    document.value("leaflet.media-badly-removed", true);

                    _update_leaflet_status("bad-removal");    
                }
            }
        },

        on_media_unmounted: function(media_dir) {
            var storage_dir = _find_storage_dir(media_dir);

            if (storage_dir === document.value("leaflet.storage-dir")) {
                if (!document.value("leaflet.app-force-closed")) {
                    _update_leaflet_status("unmounted");
                }

                document.value("leaflet.storage-dir", "");
            }
        },

        on_media_bad_removal: function(media_dir) {
            if (!document.value("leaflet.media-badly-removed")) {
                _update_leaflet_status("bad-removal");
            }
        },

        on_open_app: function(params) {

        },

        on_close_app: function(params) {
            if (document.value("leaflet.storage-dir")) {
                if (!document.value("leaflet.app-force-closed")) {
                    _update_leaflet_status("closed");
                }

                document.value("leaflet.app-running", false);
            }
        },

        open_app_again: function() {
            var storage_dir = document.value("leaflet.storage-dir");

            if (storage_dir && _in_foreground) {
                _watch_and_run_app(storage_dir);
            }
        },
    }
})();

__MODULE__ = module;

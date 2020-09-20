var module = (function() {
    const apps  = require("apps"),
          books = require("books");

    const _methods = {
        app: function(params) {
            apps.open_app(params["app"], params["url"], params);
        },

        book: function(params) {
            books.open_book(params["book"], params["url"], params);
        },
    }

    return {
        invoke: function(method, params) {
            if (_methods.hasOwnProperty(method)) {
                _methods[method](params);
            }
        },
    }
})();

__MODULE__ = module;

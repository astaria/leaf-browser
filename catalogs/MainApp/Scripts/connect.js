Connect = (function() {
    return {}
})()

Connect.apps  = require("apps")
Connect.books = require("books")

Connect.invoke = function(method, params) {
    if (Connect.hasOwnProperty("__invoke_" + method)) {
        Connect["__invoke_" + method](params)
    }
}

Connect.__invoke_app = function(params) {
    Connect.apps.open_app(params["app"], params["url"], params)
}

Connect.__invoke_book = function(params) {
    Connect.books.open_book(params["book"], params["url"], params)
}

__MODULE__ = Connect

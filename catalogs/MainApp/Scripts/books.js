var module = (function() {
    return {
        open_book: function(book_id, url, params) {
            controller.action("open", { 
                "filename":book_id,
                "root-path":"catalog@data",
                "dir-path":"books",
                "format":"bxp",
                "url":url 
            })
        },
    }
})();

__MODULE__ = module;

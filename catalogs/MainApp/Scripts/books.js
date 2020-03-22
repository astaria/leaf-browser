Books = (function() {
    return {}
})()

Books.open_book = function(book_id, url) {
    controller.action("open", { 
        "filename":book_id,
        "root-path":"catalog@data",
        "dir-path":"books",
        "format":"bxp",
        "url":url 
    })
}

__MODULE__ = Books

function open_notif() {
    controller.action("subview", {
        "subview":"V_NOTIF", 
        "target":"popup" 
    })
}

function search_apps() {
    controller.action("subview", {
        "subview":"V_SEARCH", 
        "target":"popup" 
    })
}

function open_books() {
    controller.action("subview", {
        "subview":"V_BOOKS", 
        "target":"popup" 
    })
}

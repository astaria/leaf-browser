var module = (function() {
    return {
        update_device_token: function(token) {
            return new Promise(function(resolve, reject) {
                var url = "https://us-central1-astaria-leaf.cloudfunctions.net/updateDeviceToken";
                var options = { "includes-session-headers":true }
            
                fetch(url, { 
                    method:"POST", 
                    body:JSON.stringify({ "device-token":token }),
                    headers:{
                        "Content-Type":"application/json"
                    }
                }, options).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            resolve(data)
                        });
                    } else {
                        reject({ "status":response.status });
                    }
                }, function(error) {
                    reject(error);
                });
            })    
        },
        
        activate_app: function(params) {
            return new Promise(function(resolve, reject) {
                var url = "https://us-central1-astaria-leaf.cloudfunctions.net/activateApp";
                var options = { "includes-session-headers":true }
            
                fetch(url, { 
                    method:"POST", 
                    body:JSON.stringify(params),
                    headers:{
                        "Content-Type":"application/json"
                    }
                }, options).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            resolve(data);
                        })
                    } else {
                        reject({ "status":response.status });
                    }
                }, function(error) {
                    reject(error);
                })
            })
        },
        
        deactivate_app: function(params) {
            return new Promise(function(resolve, reject) {
                var url = "https://us-central1-astaria-leaf.cloudfunctions.net/deactivateApp";
                var options = { "includes-session-headers":true }
            
                fetch(url, { 
                    method:"POST", 
                    body:JSON.stringify(params),
                    headers:{
                        "Content-Type":"application/json"
                    }
                }, options).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            resolve(data);
                        })
                    } else {
                        reject({ "status":response.status });
                    }
                }, function(error) {
                    reject(error);
                });
            });
        },        
    }
})();

__MODULE__ = module;

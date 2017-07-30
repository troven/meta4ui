const AjaxRequest = function(cmd) {
    var self = this;
    var promise = new Promise(function(resolve, reject) {
        var ajax = { type: cmd.type, url: cmd.url,  headers: {}, contentType: false, processData: false };

        if (cmd.data) {
            ajax.data = cmd.data
        }
        var token = cmd.access_token;
        if (token) {
            ajax.headers.Authorization = "BEARER " + cmd.token;
        }
        ajax.success = resolve;
        ajax.error = function(xhr, err, msg) {
            console.error("AJAX Error: %o", arguments);
            if (xhr.responseJSON) {
                var txt = "["+xhr.responseJSON.code+"] "+xhr.responseJSON.error;
            } else {
                console.error("ERROR GetMany: %o", arguments);
                alert("ERROR: "+msg +" @ "+cmd.url);
            }
            reject.apply(self, arguments);
        }

        self.debug && console.log("ajaxRequest[%s]: %o -> %o", cmd.type, cmd.url, ajax);
        $.ajax(ajax);
    });

    return promise;
};

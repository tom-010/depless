var users = [];

(function fakeBackend() {

    on('request-created', function(args) {
        if(args[1]) {
            this.users.push(JSON.parse(args[0].body));
            return [args[1], args[0]];
        }
    });

    on('user-fetch', function(args) {
        return [args[0], users];
    });

})();


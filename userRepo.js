var users = [];

(function inMemoryUserRepo() {

    before('user-created', function(args) {
        console.log(args[0]);
        users.push(args[0]);
    });

    on('user-fetch', function(args) {
        return [args[0], users];
    });
})();
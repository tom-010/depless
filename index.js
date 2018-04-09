(function userForm() {

    on('default-route', function(args) {
        return['routing', 'user-form'];
    });

})();

(function listUsers() {
    on('list-users-loaded', function (args) {
        return ['user-fetch', 'user-fetched'];
    });
})();
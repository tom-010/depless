(function userForm() {
    on('user-name-input', function (args) {
        const username = args[0];
        element('user-name-display').innerHTML = username;
        return ['user-name-displayed', element('user-name-display')];
    });

    on('user-name-displayed', function(args) {
        console.log("Hello, ", args[0].innerHTML);
    });

    on('user-form-validation-error', function(args) {
        element('messages').innerHTML = args[0];
    });

    on('default-route', function(args) {
        return['routing', 'user-form'];
    });

})();

(function listUsers() {
    on('list-users-loaded', function (args) {
        return ['user-fetch', 'user-fetched'];
    });

    on('user-fetched', function(args) {
        var users = args[0];
        element('user-list').innerHTML = "";
        for(var i=0; i<users.length; i++)
            element('user-list').innerHTML += "<li>"+ users[i].userName + "</li>";
        return ['users-displayed', users]
    }, function forExample() {
        element = function (id) { console.log('id'); return {}};
        say('user-fetched')
            .withInput({userName: "un"})
            .returns('users-displayed');
    })
})();
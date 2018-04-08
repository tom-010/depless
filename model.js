(function userModule() {

    on('user-validated-for-safe', function(args) {
        const request = {};
        request.url = "www.backend.de";
        request.method = "POST";
        request.body = JSON.stringify(args[0]);
        res('request-created', request, 'handle-server-user-created');
    });


    on('user-form-submitted', function(args) {
        const user = args[0];
        if(!user.userName) {
            res('user-form-validation-error', 'User-Name must not be empty!');
            return;
        }

        res('user-validated-for-safe', user);

    }, function forExample(){
        say('user-form-submitted')
            .withInput({userName: "Tom", firstName: "T", lastName: "D"})
            .returns('user-validated-for-safe');

        say('user-form-submitted')
            .withInput({userName: null, firstName: "T", lastName: "D"})
            .returns('user-form-validation-error');
    });

    on('handle-server-user-created', function (args) {
        res('user-created', JSON.parse(args[0].body));
    });

    on('user-created', function(args) {
        console.log(args);
        res('notify', args[0].userName + ' created');
        res('routing', 'list-users')
    });


})();

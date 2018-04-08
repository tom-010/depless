

on('user-validated-for-safe', function(args) {
    const request = {};
    request.url = "www.backend.de";
    request.method = "POST";
    request.body = JSON.stringify(args[0]);
    res('request-created', request);
});

on('user-form-submitted', function(args) {
    const user = args[0];
    if(!user.userName) {
        res('user-form-validation-error', 'User-Name must not be empty!');
        return;
    }

    res('user-validated-for-safe', user);
});

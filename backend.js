(function fakeBackend() {

    on('request-created', function(args) {
        if(args[1])
            return [args[1], args[0]];
    });

})();


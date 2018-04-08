(function backend() {

    on('request-created', function(args) {
        console.log("Sending Request", args[0]);
        if(args[1])
            res(args[1], args[0])
    });

})();


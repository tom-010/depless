(function notification() {

    on('notify', function(args) {
        console.log(args)
        alert(args[0]);
    })

})();
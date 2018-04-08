(function notification() {

    on('notify', function(args) {
        alert(args[0]);
    })

})();
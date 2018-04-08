(function routing() {

    on('routing', function(args) {
        var pages = document.getElementsByClassName("page");
        for(var i=0; i<pages.length; i++) {
            if(pages[i].id === args[0])
                pages[i].style.display = "block";
            else
                pages[i].style.display = "none";
        }
        return [args[0]+"-loaded"]
    });

    function routeFromUrl() {
        var hash = window.location.hash;
        if(!hash)
            return null;
        return hash.substr(1);
    }

    on('application-started', function(args) {
        var route = routeFromUrl();

        if(route)
            return ['routing', route];
        else
            return['default-route']
    });

})();
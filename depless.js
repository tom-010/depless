const dom = document;

const channelsWithSubscribers = {};

function res(topic /*args...*/) {
    if(!channelsWithSubscribers[topic])
        return;

    for(var i=0; i < channelsWithSubscribers[topic].length; i++) {
        var taker = channelsWithSubscribers[topic][i];
        if(taker) {  // v-- Arguments is not an array, we have to convert to get access to the array functions
            const args = Array.prototype.slice.call(arguments);
            args.splice(0,1); // The first arguemnt is the message: We don't need it as argument
            taker(args);
        }
    }
}

function global(variableName) {
    if(window[variableName])
        return window[variableName];
    window[variableName] = {};
    return window[variableName];
}

function on(topic, taker) {
    if(!channelsWithSubscribers[topic])
        channelsWithSubscribers[topic] = [];
    channelsWithSubscribers[topic].push(taker);
}

function element(id) {
    return document.getElementById(id);
}

function value(domElement) {
    return domElement.innerHTML;
}
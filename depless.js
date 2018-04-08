const dom = document;

const channelsWithSubscribers = {};
const examples = [];


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

function on(topic, taker, functionExamples) {
    if(!channelsWithSubscribers[topic])
        channelsWithSubscribers[topic] = [];
    channelsWithSubscribers[topic].push(taker);
    if(functionExamples)
        examples.push(functionExamples);
}

function element(id) {
    return document.getElementById(id);
}

function value(domElement) {
    return domElement.innerHTML;
}

function testExamples() {
    for(var i=0; i<examples.length; i++) {
        examples[i]();
    }
}

var testLog = function(/* messages */) {
    console.log(arguments); // default logger;
};

function assert(functionName) {
    return {
        withInput: function(args) {
            return {
                returns: function(topic, expectedValue) {
                    var wasCalled = false;
                    var ok = true;
                    on(topic, function (resultArgs) {
                        wasCalled = true;
                    });

                    res(topic, args);

                    if(!wasCalled) {
                        testLog('FAIL: ', "Did not trigger topic '"+topic+"'")
                        ok = false;
                    }

                    if(ok) {
                        testLog('SUCCESS: ', topic, args);
                    }
                }
            }
        }
    }
}

var say = assert;
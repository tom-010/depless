/**
 * For accessing the dom. In an extra variable instead of document for the ability to install
 * mocks, spies, etc in this variable
 * @type {Document}
 */
var dom = document;

var channelsWithSubscribers;
var examples = [];
var callHistory;
channelsWithSubscribers = {before: {}, on: {}, after: {}};


function init() {
    callHistory = [];
}
init();
const resetEnvironment = init


/**
 * Like return in other systems. This method triggers a message that gets published
 * into the channel of the given topic
 * @param topic
 * @param params... Prams, that are given to the listener
 */
function res(topic /*, args...*/) {
    if(!channelsWithSubscribers['on'][topic])
        return;

    var i = 0;
    var caller = res.caller;

    if(channelsWithSubscribers['before'][topic])
        for(i=0; i < channelsWithSubscribers['before'][topic].length; i++)
            _sendMessageToTaker(channelsWithSubscribers['before'][topic][i], arguments, caller);

    for(i=0; i < channelsWithSubscribers['on'][topic].length; i++)
        _sendMessageToTaker(channelsWithSubscribers['on'][topic][i], arguments, caller);

    if(channelsWithSubscribers['after'][topic])
        for(i=0; i < channelsWithSubscribers['after'][topic].length; i++)
            _sendMessageToTaker(channelsWithSubscribers['after'][topic][i], arguments, caller);
}

/*private*/ function _sendMessageToTaker(taker, args, caller) {
    if(!taker)
        return;
    args = Array.prototype.slice.call(args); // Arguments is not an array, we have to convert to get access to the array functions
    var functionName = args.splice(0,1)[0]; // The first argument is the message: We don't need it as argument
    callHistory.push({function: functionName, arguments: args, caller: caller});
    var result = taker(args);    // |-> The taker can return an array what is equivalent with calling 'res([..]); return'
    if(result)                   // |   These three lines enables this short version
        res.apply(this, result); // |
}

function printTrace() {
    console.log("--- Trace Start (most recent first) ---");
    callHistory.reverse().forEach(function(entry) {
        console.log(entry.function, entry.arguments, entry.caller.name);
    });
    console.log("--- Trace End -------------------------");
}

/**
 * To define global variables in the UI. The application is stateless unless the UI. The UI can access te UI-Namespace
 * (java-script window object) to store the state. This state can be uses as input-parameter on the first event
 * that triggers further event, that only use their respective input-parameters.
 * @param variableName The name in the global namespace
 * @returns {*} A reference to the variable
 */
function global(variableName) {
    if(window[variableName])
        return window[variableName];
    window[variableName] = {};
    return window[variableName];
}

/**
 * This method is like on, but every taker here is called before the first taker on the on channel
 * @param topic See on function
 * @param taker See on function
 * @param functionExamples See on function
 */
function before(topic, taker, functionExamples) {
    _subscribe('before', topic, taker, functionExamples);
}

/**
 * This is the counter-part to before: Every function that is registered with after is called after the last
 * function that was registered with on.
 * @param topic
 * @param taker
 * @param functionExamples
 */
function after(topic, taker, functionExamples) {
    _subscribe('after', topic, taker, functionExamples);
}

/**
 * To Listen for a topic and get called, when a message is published in the channel of the topic.
 * @param topic The topic of the channel, where the taker should listen
 * @param taker The callback function that gets called as soon a message is published into the channel of the topic
 * @param functionExamples Examples of usage in form of unit tests with input data and output-data check. This function will executed when the tests are executed and the examples are part of the documentation of the function.
 */
function on(topic, taker, functionExamples) {
    _subscribe('on', topic, taker, functionExamples);
}

function _subscribe(type, topic, taker, functionExamples) {
    if(!channelsWithSubscribers[type][topic])
        channelsWithSubscribers[type][topic] = [];
    channelsWithSubscribers[type][topic].push(taker);
    if(functionExamples)
        examples.push(functionExamples);
}

/**
 * Only is useful for tests, if the tester want to clear the complete channel and register only himself
 * for checking the result. No other side-effects like sending traffic around etc.
 * @param topic The topic where the taker want to listen
 * @param taker The taker that will be called when a message is published in the channel of the topic
 */
function only(topic, taker) {
    channelsWithSubscribers['on'][topic] = [];
    on(topic, taker);
}

/**
 * Searches of a reference for the HTML-Element with the given ID
 * @param id The HTML-ID of the desired element
 * @returns {HTMLElement | null}
 */
var element = function(id) {
    return document.getElementById(id);
};

/**
 * Helper function to extract the value of a given HTMLElement
 * @param domElement
 * @returns {*|string}
 */
function value(domElement) {
    return domElement.innerHTML;
}

/**
 * Runs all examples as tests
 */
function testExamples() {
    for(var i=0; i<examples.length; i++) {
        resetEnvironment();
        examples[i]();
    }

}

/**
 * Logger for the tests. This can be overridden by reassigning for other display devices.
 * The default outputs an the console.
 */
var testLog = function(/* messages */) {
    console.log(arguments); // default logger;
};

/**
 * An assert-command for unit-tests
 * @param functionName
 * @returns {{withInput: withInput}}
 */
function assert(functionName) { return {
        withInput: function(args) {return {
                returns: function(topic, expectedValue) {
                    var wasCalled = false;
                    var ok = true;
                    on(topic, function (resultArgs) {
                        wasCalled = true;
                    });

                    res(topic, args);

                    if(!wasCalled) {
                        testLog('FAIL: ', "Did not trigger topic '"+topic+"'");
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

/**
 * Better name for assert in the context of examples
 * @type {assert}
 */
var say = assert;

/**
 * Send is in some contexts a better name as res This is an alias
 * @type {res}
 */
var send = res;

/**
 * A collection of e2e-scenarios. You can register them here viea the scenario function an run them
 * via the runScenarios function
 * @type {Array}
 */
var scenarios = [];

/**
 * Register new e2e test
 * @param s A test method that will be called with a fail-method for signaling failure. For details see the runScenarios function
 */
function scenario(s) {
    scenarios.push(s);
}

/**
 * Runner for the e2e test. Register them vie the scenario-function.
 * In the test-method, that you can give to the scenario-function you can call
 * fail('message') so signal, that the scenario failed
 */
function runScenarios() {
    for(var i=0; i<scenarios.length; i++) {
        resetEnvironment();
        var ok = true;
        var errorMessage = "";

        scenarios[i](function(message) {
            ok = false;
            errorMessage = message;
        });

        if(ok) {
            testLog("SUCCESS: " + scenarios[i].name);
        } else {
            testLog("ERROR: " + scenarios[i].name + " - " + errorMessage);
        }
    }
}
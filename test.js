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
                        console.log('FAIL: ', "Did not trigger topic '"+topic+"'")
                        ok = false;
                    }

                    if(ok) {
                        console.log('SUCCESS: ', topic, args);
                    }
                }
            }
        }
    }
}
/**
 * SimpleTest.js is a simple test suite framework.
 * @author Ali Najafizadeh
 * @date 2014
 * @version 0.0.5
 * @Licence MIT
 */
(function () {
    "use strict";

    var suites = [],
        isBrowser,
        suiteCount = 0,
        currentSuite = 0,
        defaultTimeout = 1000;

    function nextSuite() {
        if (suites[currentSuite]) {
            currentSuite++;
            return suites[currentSuite - 1];
        } else {
            return false;
        }
    }

    function runTests(suite) {
        if (!suite) return;

        console.log(suite.description);

        var testCounter = 0,
            failedCounter = 0,
            timeoutCounter = 0;

        function next() {
            testCounter++;
            if (suite.tests.length == testCounter) {
                suite.afterAllTests();
                console.log("");
                console.log("    Suite Result");
                console.log("       Succeed: " + (testCounter - failedCounter - timeoutCounter) +
                    ", Failed: " + failedCounter +
                    ", Timeout: " + timeoutCounter +
                    ", Total: " + testCounter);
                console.log("");
                setTimeout(function () {
                    runTests(nextSuite());
                }, 13);
            } else {
                suite.beforeEveryTest();
            }
        }

        suite.beforeEveryTest();

        suite.tests.forEach(function (test) {
            var proceed = true,
                internalTimeout;

            internalTimeout = setTimeout(function () {
                proceed = false;
                console.log("    TIMEOUT : " + test.testName);
                timeoutCounter++;
                next();
            }, suite.timeout || defaultTimeout);

            test.test({
                assert: function (errMessage, logic) {
                    if (!proceed) return;

                    if (typeof errMessage !== "string") {
                        logic = errMessage;
                        errMessage = "";
                    }

                    if (logic) {
                        console.log("    OK : " + test.testName);
                    } else {
                        console.log("    ERROR : " + test.testName + ((errMessage != "") ? " -> " + errMessage : ""));
                        failedCounter++;
                    }

                    clearTimeout(internalTimeout);
                    next();
                }
            });
        });
    }

    function SimpleTest(description, func, options) {
        var tests = [],
            beforeEveryTest = function () { },
            afterAllTests = function () { };

        options = options || {};

        func({
            beforeEveryTest: function (func) {
                beforeEveryTest = func;
            },
            it: function (testName, func) {
                tests.push({
                    testName: testName,
                    test: func
                });
            },
            afterAllTests: function (func) {
                afterAllTests = func;
            }
        });

        suites.push({
            timeout: options.timeout,
            description: description,
            tests: tests,
            beforeEveryTest: beforeEveryTest,
            afterAllTests: afterAllTests
        });
    }

    function LoadTestFiles(options) {
        var requiredPath;

        if (isBrowser) {
            throw "`LoadTestFiles` method is not meant for browser.";
        }

        if (!options || !options.path || !options.filename) {
            throw "options are not passed correctly.";
        }

        options.path = __dirname + '/../../../' + options.path;

        defaultTimeout = options.timeout || 5000;

        while (true) {
            try {
                requiredPath = options.path + '/' + options.filename.replace('?', (suiteCount + 1) + '');
                require(requiredPath);
                suiteCount++;
            } catch (e) {
                break;
            }
        }
    }

    SimpleTest.Run = function () {
        runTests(nextSuite());
    };

    SimpleTest.LoadTestFiles = LoadTestFiles;

    try {
        module.exports = SimpleTest;
        isBrowser = false;
    } catch (e) {
        window.SimpleTest = SimpleTest;
        isBrowser = true;
    }
}());
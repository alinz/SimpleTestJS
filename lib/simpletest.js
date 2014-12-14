(function () {
  "use strict";
  var SimpleTest = {},
  suites = [],
  isBrowser;

  /*
  * gets an array and returns a function. This is a versy simple
  * implementation of generator for array. The return function is called 'next'
  * and can be invoked multiple times until it returns undefined.
  */
  function poppy(arr) {
    var index = 0,
    length = arr.length;

    return function () {
      var value;
      if (index < length) {
        value = arr[index];
        index++;
      }
      return value;
    };
  }

  function asynCall(func) {
    setTimeout(func, 0);
  }

  function log(str) {
    console.log(str);
  }

  SimpleTest.suite = function (description, func, options) {
    var tests = [],
    //I made these function to get one argumentand call it inside.
    funcBeforeEveryTest = function (done) { done(); },
    funcAfterAllTests = function (done) { done(); };

    //for now the only option available is timeout.
    options = options || {};
    //the default value of timeout is 5 seconds.
    options.timeout = options.timeout || 5000;

    func({
      beforeEveryTest: function (func) {
        funcBeforeEveryTest = func;
      },
      it: function (description, func) {
        tests.push({
          description: description,
          func: func
        });
      },
      afterAllTests: function (func) {
        funcAfterAllTests = func;
      }
    });

    suites.push({
      timeout: options.timeout,
      description: description,
      tests: tests,
      beforeEveryTest: funcBeforeEveryTest,
      afterAllTests: funcAfterAllTests
    });
  };

  SimpleTest.run = function () {
    //converts a suites array into poppy generator function. So every nextSuite()
    //will returns the next item in the array.
    var cleanupAfter = function (done) { done(); },
    nextSuite = poppy(suites),

    //this variable is used to prevent call report function at the start
    justStarted = true,

    succeedTests = 0,
    failedTests = 0,
    timeoutTests = 0;

    function report() {
      var message = "\n\n";

      message += "    Success : " + succeedTests + "\n";
      message += "       Fail : " + failedTests + "\n";
      message += "    Timeout : " + timeoutTests + "\n";


      log(message);
    }

    //this function invokes the first functions and pass a function as an
    //argument which calls the second function. The reason I made this function
    //is to call beforeEveryTest function and once that function is done, call
    //the test itself. It is useful if your first function made some async call.
    function sandwitch(func1, func2, arg) {
      func1(function () {
        func2(arg);
      });
    }

    //It goes through all test suites by invoking nextSuite() until it returns
    //undefined. Since this function will call loopTest recursively, I need to
    //run it through asynCall to make sure that I don't overflow stacks in
    //javascript.
    function loopSuite() {
      var suite;

      //prints the report
      if (!justStarted) {
        report();
        justStarted = false;
      }

      cleanupAfter(function () {
        suite = nextSuite();
        if (suite) {
          justStarted = false;

          cleanupAfter = suite.afterAllTests;

          log("\n");
          log(suite.description);

          //reset values for the next suite
          succeedTests = 0;
          failedTests = 0;
          timeoutTests = 0;

          asynCall(function () {
            suite.nextTest = poppy(suite.tests);
            loopTest(suite);
          });
        } else {
          log("\n\nAll suites are processed.");
          if (!isBrowser) {
            process.exit(0);
          }
        }
      });
    }

    function loopTest(suite) {
      var nextTest = suite.nextTest,
      test = nextTest(),
      timeout = suite.timeout,
      timeoutId = 0,
      timeoutTriggered = false,
      proceed = true,
      before,
      after;

      //if there is no more test left, we should call loopSuite function so
      //we can go to next testSuite.
      if (!test) {
        asynCall(loopSuite);
        return;
      }

      before = suite.beforeEveryTest;
      after = suite.afterAllTests;

      sandwitch(before, function (done) {
        timeoutId = setTimeout(function () {
          timeoutTriggered = true;
          done();
        }, timeout);

        test.func(done);
      }, function (description, expression) {
        var message;

        if (!proceed) {
          return;
        }

        message = test.description;

        clearTimeout(timeoutId);

        if (timeoutTriggered) {
          timeoutTests++;
          message = "TIMEOUT : " + message + " : caused by timeout";
        } else if (expression) {
          succeedTests++;
          message = "OK      : " + message;
        } else {
          failedTests++;
          message = "Error   : " + message + " : caused by '" + description + "'";
        }

        log("    " + message);

        proceed = false;

        asynCall(function () {
          loopTest(suite);
        });
      });
    }

    loopSuite();
  };

  try {
    module.exports = SimpleTest;
    isBrowser = false;
  } catch(e) {
    window.SimpleTest = SimpleTest;
    isBrowser = true;
  }
}());

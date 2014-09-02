### SimpleTestJS


Write your tests like this.

```js
SimpleTest("Test Suite 1", function (suite) {
    suite.beforeEveryTest(function () {
        console.log("BEFORE");
    });

    suite.it("should return true 1", function (test) {
        test.assert("", true);
    });

    suite.it("should return true 2", function (test) {
        test.assert("", true);
    });

    suite.afterAllTests(function () {
        console.log("AFTER");
    });
});

SimpleTest("Test Suite 2", function (suite) {
    suite.beforeEveryTest(function () {
        console.log("BEFORE");
    });

    suite.it("should return true 1", function (test) {
        test.assert("", true);
    });

    suite.it("should return true 2", function (test) {
        test.assert("", true);
    });

    suite.afterAllTests(function () {
        console.log("AFTER");
    });
});
```

Once everything is written, call the following command to run it.

```js
SimpleTest.Run();
```

if you are working on Async calls and you want to wait longer that defaultTimeout, which is 1000 milliseconds, you can override the value per suite cases.
 
```js
SimpleTest("Test Suite 2", function (suite) {
    suite.beforeEveryTest(function () {
        console.log("BEFORE");
    });

    suite.it("should return true 1", function (test) {
        test.assert("", true);
    });

    suite.it("should return true 2", function (test) {
        test.assert("", true);
    });

    suite.afterAllTests(function () {
        console.log("AFTER");
    });
}, { timeout: 5000 });
```

The 3rd argument for SimpleTest is an options object which accept timeout as a key and the value for that overrides defaultTimeout for that suite only.


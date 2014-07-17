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


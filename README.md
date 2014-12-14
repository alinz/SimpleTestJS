### SimpleTestJS


Write your tests like this.

```js
SimpleTest.suite("Test Suite 1", function (test) {

  test.beforeEveryTest(function (done) {
    setTimeout(function () {
      done();
    }, 1000);
  });

  test.it("should work", function (assert) {
    setTimeout(function () {
      assert("nooooo", true);
    }, 6000);
  });

  test.it("should not work", function (assert) {
    assert("the value is false", false);
  });

  test.afterAllTests(function (done) {
    console.log("cleanup");
    done();
  });

}, { timeout: 1000 });

SimpleTest.suite("Test Suite 2", function (test) {

  test.beforeEveryTest(function (done) {
    //setTimeout(function () {
    done();
    //}, 1000);
  });

  test.it("should work", function (assert) {
    assert("nooooo", true);
  });

  test.it("should not work", function (assert) {
    assert("the value is false", false);
  });

});

//run it like this
SimpleTest.run();
```

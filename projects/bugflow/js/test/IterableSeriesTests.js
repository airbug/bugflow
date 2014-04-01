//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('List')
//@Require('bugflow.IterableSeries')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var List            = bugpack.require('List');
var IterableSeries  = bugpack.require('bugflow.IterableSeries');
var BugMeta         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/**
 * This tests..
 * 1) That each item in the List is iterated over in IterableSeries execute
 * 2) That each items in the List is iterated in order
 * 3) That the
 */
var bugflowExecuteIterableSeriesTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testIndex = -1;
        this.testList = new List([
            "value1",
            "value2",
            "value3"
        ]);
        this.actualOrder = [];
        this.testIteratorMethod = function(flow, value) {
            _this.testIndex++;
            _this.actualOrder.push(value);
            test.assertEqual(value, _this.testList.getAt(_this.testIndex),
                "Assert value matches test index value");
            flow.complete();
        };
        this.iterableSeries = new IterableSeries(this.testList, this.testIteratorMethod);
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var executeCallbackFired = false;
        this.iterableSeries.execute(function(error) {
            test.assertFalse(executeCallbackFired,
                "Assert that the execute callback has not already fired");
            executeCallbackFired = true;
            for (var i = 0, size = _this.actualOrder.length; i < size; i++) {
                test.assertEqual(_this.actualOrder[i], _this.testList.getAt(i),
                    "Assert that actual order matches the list");
            }
            if (!error) {
                test.assertEqual(_this.testIndex, 2,
                    "Assert that the IterableSeries iterated 3 times");
            } else {
                test.error(error);
            }
        });
    }
};
bugmeta.annotate(bugflowExecuteIterableSeriesTest).with(
    test().name("BugFlow IterableSeries execute test")
);

/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var BugFlow             = bugpack.require('bugflow.BugFlow');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag      = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var test                = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests..
     * 1) That the while parallel completes
     */
    var bugflowExecuteWhileParallelTest = {

        async: true,


        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this = this;
            this.testIndex = 0;
            this.numberTestTaskRuns = 0;
            this.testWhileMethod = function(flow) {
                flow.assert(_this.testIndex < 2);
            };
            this.testTask = BugFlow.$task(function(flow) {
                _this.testIndex++;
                setTimeout(function() {
                    _this.numberTestTaskRuns++;
                    flow.complete();
                }, 0);
            });
            this.whileParallel = BugFlow.$whileParallel(this.testWhileMethod, this.testTask);
            test.completeSetup();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var executeCallbackFired = false;
            this.whileParallel.execute(function(throwable) {
                test.assertFalse(executeCallbackFired,
                    "Assert that the execute callback has not already fired");
                executeCallbackFired = true;
                test.assertEqual(_this.numberTestTaskRuns, 2,
                    "Assert testTask was run twice");
                if (!throwable) {
                    test.assertEqual(_this.testIndex, 2,
                        "Assert that the ForEachParallel iterated 2 times");
                } else {
                    test.error(throwable);
                }
                test.completeTest();
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(bugflowExecuteWhileParallelTest).with(
        test().name("BugFlow WhileParallel - execute test")
    );
});

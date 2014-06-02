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
//@Require('bugflow.Flow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Flow        = bugpack.require('bugflow.Flow');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var test        = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     * This tests..
     * 1) That the Flow is marked as executed after execute is called
     */
    var bugflowExecuteFlowTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.flow = new Flow();
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.flow.execute();
            test.assertEqual(this.flow.hasExecuted(), true,
                "Assert flow has executed");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(bugflowExecuteFlowTest).with(
        test().name("BugFlow Flow execute without extension test")
    );
});

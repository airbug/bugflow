/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.BugFlow')

//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Flows   = bugpack.require('Flows');
    var Obj     = bugpack.require('Obj');
    var Proxy   = bugpack.require('Proxy');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var BugFlow = Class.extend(Obj, {
        _name: "bugflow.BugFlow"
    });


    //-------------------------------------------------------------------------------
    // Static Proxy
    //-------------------------------------------------------------------------------

    Proxy.proxy(BugFlow, Proxy.object(Flows), [
        "$forEachParallel",
        "$forEachSeries",
        "$forInParallel",
        "$forInSeries",
        "$if",
        "$iterableParallel",
        "$iterableSeries",
        "$parallel",
        "$series",
        "$task",
        "$whileParallel",
        "$whileSeries"
    ]);


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugflow.BugFlow', BugFlow);
});

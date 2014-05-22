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
//@Require('Obj')
//@Require('bugflow.FlowBuilder')
//@Require('bugflow.ForEachParallel')
//@Require('bugflow.ForEachSeries')
//@Require('bugflow.ForInParallel')
//@Require('bugflow.ForInSeries')
//@Require('bugflow.If')
//@Require('bugflow.IfBuilder')
//@Require('bugflow.IterableParallel')
//@Require('bugflow.IterableSeries')
//@Require('bugflow.Parallel')
//@Require('bugflow.Series')
//@Require('bugflow.Task')
//@Require('bugflow.WhileParallel')
//@Require('bugflow.WhileSeries')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var FlowBuilder         = bugpack.require('bugflow.FlowBuilder');
    var ForEachParallel     = bugpack.require('bugflow.ForEachParallel');
    var ForEachSeries       = bugpack.require('bugflow.ForEachSeries');
    var ForInParallel       = bugpack.require('bugflow.ForInParallel');
    var ForInSeries         = bugpack.require('bugflow.ForInSeries');
    var If                  = bugpack.require('bugflow.If');
    var IfBuilder           = bugpack.require('bugflow.IfBuilder');
    var IterableParallel    = bugpack.require('bugflow.IterableParallel');
    var IterableSeries      = bugpack.require('bugflow.IterableSeries');
    var Parallel            = bugpack.require('bugflow.Parallel');
    var Series              = bugpack.require('bugflow.Series');
    var Task                = bugpack.require('bugflow.Task');
    var WhileParallel       = bugpack.require('bugflow.WhileParallel');
    var WhileSeries         = bugpack.require('bugflow.WhileSeries');


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
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {Array.<*>} data
     * @param {function(Flow, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    BugFlow.$forEachParallel = function(data, iteratorMethod) {
        return new FlowBuilder(ForEachParallel, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Array.<*>} data
     * @param {function(Flow, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    BugFlow.$forEachSeries  = function(data, iteratorMethod) {
        return new FlowBuilder(ForEachSeries, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Object} data
     * @param {function(Flow, *, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    BugFlow.$forInParallel  = function(data, iteratorMethod) {
        return new FlowBuilder(ForInParallel, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Object} data
     * @param {function(Flow, *, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    BugFlow.$forInSeries    = function(data, iteratorMethod) {
        return new FlowBuilder(ForInSeries, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {function()} ifMethod
     * @param {Flow} ifFlow
     * @return {IfBuilder}
     */
    BugFlow.$if = function(ifMethod, ifFlow) {
        return new IfBuilder(If, [ifMethod, ifFlow]);
    };

    /**
     * @static
     * @param {Array<*>} data
     * @param {function(Flow, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    BugFlow.$iterableParallel = function(data, iteratorMethod) {
        return new FlowBuilder(IterableParallel, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Array<*>} data
     * @param {function(Flow, *)} iteratorMethod
     * @return {FlowBuilder}
     */
    BugFlow.$iterableSeries = function(data, iteratorMethod) {
        return new FlowBuilder(IterableSeries, [data, iteratorMethod]);
    };

    /**
     * @static
     * @param {Array.<Flow>} flowArray
     * @return {FlowBuilder}
     */
    BugFlow.$parallel = function(flowArray) {
        return new FlowBuilder(Parallel, [flowArray]);
    };

    /**
     * @static
     * @param {Array.<Flow>} flowArray
     * @return {FlowBuilder}
     */
    BugFlow.$series = function(flowArray) {
        return new FlowBuilder(Series, [flowArray]);
    };

    /**
     * @static
     * @param {function(Flow)} taskMethod
     * @return {FlowBuilder}
     */
    BugFlow.$task = function(taskMethod) {
        return new FlowBuilder(Task, [taskMethod]);
    };

    /**
     * @static
     * @param {function(Flow)} whileMethod
     * @param {Flow} whileFlow
     * @returns {FlowBuilder}
     */
    BugFlow.$whileParallel    = function(whileMethod, whileFlow) {
        return new FlowBuilder(WhileParallel, [whileMethod, whileFlow]);
    };

    /**
     * @static
     * @param {function(Flow)} whileMethod
     * @param {Flow} whileFlow
     * @returns {FlowBuilder}
     */
    BugFlow.$whileSeries    = function(whileMethod, whileFlow) {
        return new FlowBuilder(WhileSeries, [whileMethod, whileFlow]);
    };


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugflow.BugFlow', BugFlow);
});

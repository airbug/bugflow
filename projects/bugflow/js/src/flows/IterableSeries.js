/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.IterableSeries')

//@Require('Class')
//@Require('IIterable')
//@Require('bugflow.Iteration')
//@Require('bugflow.IteratorFlow')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IIterable       = bugpack.require('IIterable');
    var Iteration       = bugpack.require('bugflow.Iteration');
    var IteratorFlow    = bugpack.require('bugflow.IteratorFlow');
    var BugTrace        = bugpack.require('bugtrace.BugTrace');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $error          = BugTrace.$error;
    var $trace          = BugTrace.$trace;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IteratorFlow}
     */
    var IterableSeries = Class.extend(IteratorFlow, {

        _name: "bugflow.IterableSeries",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {IIterable} data
         * @param {function(Flow, *)} iteratorMethod
         */
        _constructor: function(data, iteratorMethod) {

            this._super(data, iteratorMethod);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            if (!Class.doesImplement(data, IIterable)) {
                throw new Error("IterableSeries only supports IIterable instances.");
            }

            /**
             * @private
             * @type {IIterator}
             */
            this.iterator = data.iterator();
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            if (!this.data) {
                this.error("data value must be iterable");
            }
            if (this.iterator.hasNext()) {
                this.next();
            } else {
                this.complete();
            }
        },


        //-------------------------------------------------------------------------------
        // IteratorFlow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} args
         * @param {Throwable} throwable
         */
        iterationCallback: function(args, throwable) {
            if (throwable) {
                if (!this.hasErrored()) {
                    this.error(throwable);
                }
            } else {
                if (!this.iterator.hasNext()) {
                    this.complete();
                } else {
                    this.next();
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        next: function() {
            var nextValue = this.iterator.next();
            this.executeIteration([nextValue]);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugflow.IterableSeries', IterableSeries);
});
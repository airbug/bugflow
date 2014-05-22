/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.WhileSeries')

//@Require('Bug')
//@Require('Class')
//@Require('List')
//@Require('bugflow.Flow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var List                = bugpack.require('List');
    var Flow                = bugpack.require('bugflow.Flow');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var WhileSeries = Class.extend(Flow, {

        _name: "bugflow.WhileSeries",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Flow)} whileMethod
         * @param {Flow} whileFlow
         */
        _constructor: function(whileMethod, whileFlow) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.runningWhileCheck      = false;

            /**
             * @private
             * @type {Flow}
             */
            this.whileFlow              = whileFlow;

            /**
             * @private
             * @type {function(Flow)}
             */
            this.whileMethod            = whileMethod;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            this.execArgs = args;
            this.runWhileCheck();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} bool
         */
        assert: function(bool) {
            if (this.runningWhileCheck) {
                if (bool) {
                    this.whileCheckSuccess();
                } else {
                    this.whileCheckFailed();
                }
            } else {
                throw new Bug("UnexpectedCall", {}, "Unexpected assert() call. assert might have been called twice in the same check.");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        runWhileCheck: function() {
            this.runningWhileCheck = true;
            try {
                this.whileMethod.apply(null, ([this]).concat(this.execArgs));
            } catch(throwable) {
                this.error(throwable);
            }
        },

        /**
         * @private
         */
        runWhileFlow: function() {
            var _this = this;
            this.whileFlow.execute(this.execArgs, function(throwable) {
                if (!throwable) {
                    _this.runWhileCheck();
                } else {
                    _this.error(throwable);
                }
            });
        },

        /**
         * @private
         */
        whileCheckFailed: function() {
            this.runningWhileCheck = false;
            this.complete();
        },

        /**
         * @private
         */
        whileCheckSuccess: function() {
            this.runningWhileCheck = false;
            this.runWhileFlow();
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugflow.WhileSeries', WhileSeries);
});

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.ForInParallel')

//@Require('Class')
//@Require('bugflow.IteratorFlow')
//@Require('bugflow.MappedParallelException')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var IteratorFlow                = bugpack.require('bugflow.IteratorFlow');
    var MappedParallelException     = bugpack.require('bugflow.MappedParallelException');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IteratorFlow}
     */
    var ForInParallel = Class.extend(IteratorFlow, {

        _name: "bugflow.ForInParallel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} data
         * @param {function(Flow, *)} iteratorMethod
         */
        _constructor: function(data, iteratorMethod) {

            this._super(data, iteratorMethod);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // TODO BRN: Add support for BugJs data objects that implement the IIterate interface

            /**
             * @private
             * @type {MappedParallelException}
             */
            this.exception                  = null;

            /**
             * @private
             * @type {boolean}
             */
            this.iterationCompleted         = false;

            /**
             * @private
             * @type {number}
             */
            this.numberIterationsComplete   = 0;

            /**
             * @private
             * @type {number}
             */
            this.totalIterationCount        = 0;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            for (var key in this.data) {
                this.totalIterationCount++;
                var value = this.data[key];
                this.executeIteration([key, value]);
            }
            this.iterationCompleted = true;
            this.checkIterationComplete();
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
            this.numberIterationsComplete++;
            if (throwable) {
                this.processThrowable(args, throwable);
            }
            this.checkIterationComplete();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        checkIterationComplete: function() {
            if (this.iterationCompleted && this.numberIterationsComplete >= this.totalIterationCount) {
                if (!this.exception) {
                    this.complete();
                } else {
                    this.error(this.exception);
                }
            }
        },

        /**
         * @private
         * @param {Array.<*>} args
         * @param {Throwable} throwable
         */
        processThrowable: function(args, throwable) {
            if (!this.exception) {
                this.exception = new MappedParallelException();
            }
            this.exception.putCause(args, throwable);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugflow.ForInParallel', ForInParallel);
});

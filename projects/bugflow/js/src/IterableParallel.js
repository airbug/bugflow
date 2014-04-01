//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.IterableParallel')

//@Require('Class')
//@Require('IIterable')
//@Require('bugflow.IteratorFlow')
//@Require('bugflow.MappedParallelException')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var IIterable                   = bugpack.require('IIterable');
var IteratorFlow                = bugpack.require('bugflow.IteratorFlow');
var MappedParallelException     = bugpack.require('bugflow.MappedParallelException');
var BugTrace                    = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $error = BugTrace.$error;
var $trace = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IterableParallel = Class.extend(IteratorFlow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {IIterable} data
     * @param {function(Flow, *)} iteratorMethod
     * @private
     */
    _constructor: function(data, iteratorMethod) {

        this._super(data, iteratorMethod);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        if (!Class.doesImplement(data, IIterable)) {
            throw new Error("IterableParallel only supports IIterable instances.");
        }

        /**
         * @private
         * @type {IIterable}
         */
        this.iterator = data.iterator();

        /**
         * @private
         * @type {number}
         */
        this.numberIterationsComplete = 0;

        /**
         * @private
         * @type {number}
         */
        this.totalIterationCount = 0;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this._super(args);
        if (this.iterator.hasNext()) {
            while (this.iterator.hasNext()) {
                var value = this.iterator.next();
                this.totalIterationCount++;
                this.executeIteration([value]);
            }
        } else {
            this.complete();
        }
    },


    //-------------------------------------------------------------------------------
    // IteratorFlow Implementation
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
        if (!this.iterator.hasNext() && this.numberIterationsComplete >= this.totalIterationCount) {
            if (!this.exception) {
                this.complete();
            } else {
                this.error(this.exception);
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Array.<*>} args
     * @param {Throwable} throwable
     */
    processThrowable: function(args, throwable) {
        if (!this.exception) {
            this.exception = new MappedParallelException();
        }
        this.exception.putCause(args[0], throwable);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.IterableParallel', IterableParallel);

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.ForEachParallel')

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

var $error                      = BugTrace.$error;
var $trace                      = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ForEachParallel = Class.extend(IteratorFlow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data, iteratorMethod) {

        this._super(data, iteratorMethod);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        if (Class.doesImplement(data, IIterable)) {
            throw new Error("ForEachParallel does not support IIterable instances. Use the IterableParallel instead.");
        }

        /**
         * @private
         * @type {MappedParallelException}
         */
        this.exception                  = null;

        /**
         * @private
         * @type {number}
         */
        this.numberIterationsComplete   = 0;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this._super(args);
        var _this = this;
        if (this.getData().length > 0) {
            this.getData().forEach(function(value, index) {
                _this.executeIteration([value, index]);
            });
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
        if (this.numberIterationsComplete >= this.getData().length) {
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

bugpack.export('bugflow.ForEachParallel', ForEachParallel);

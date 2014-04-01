//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.ForEachSeries')

//@Require('Class')
//@Require('IIterable')
//@Require('bugflow.IteratorFlow')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IIterable       = bugpack.require('IIterable');
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

var ForEachSeries = Class.extend(IteratorFlow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data, iteratorMethod) {

        this._super(data, iteratorMethod);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        if (Class.doesImplement(data, IIterable)) {
            throw new Error("ForEachSeries does not support IIterable instances. Use the IterableSeries instead.");
        }

        /**
         * @private
         * @type {number}
         */
        this.iteratorIndex = -1;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        if (!this.data) {
            this.error("There is not data. Data value must be iterable");
            //NOTE SUNG
            // You may need to wrap your forEachSeries in another task
            // because the data is defined before the forEachSeries is run
        }
        if (this.data.length > 0) {
            this.next();
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
        if (throwable) {
            if (!this.hasErrored()) {
                this.error(throwable);
            }
        } else {
            if (this.iteratorIndex >= (this.data.length - 1)) {
                this.complete();
            } else {
                this.next();
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    next: function() {
        this.iteratorIndex++;
        var nextValue = this.data[this.iteratorIndex];
        this.executeIteration([nextValue, this.iteratorIndex]);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.ForEachSeries', ForEachSeries);

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.IteratorFlow')

//@Require('Class')
//@Require('bugflow.Flow')
//@Require('bugflow.Iteration')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Flow            =  bugpack.require('bugflow.Flow');
var Iteration       = bugpack.require('bugflow.Iteration');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IteratorFlow = Class.extend(Flow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data, iteratorMethod) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        // TODO BRN: Add support for BugJs data objects that implement the IIterate interface

        /**
         * @private
         * @type {*}
         */
        this.data = data;

        /**
         * @private
         * @type {function(Flow, *)}
         */
        this.iteratorMethod = iteratorMethod;
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getData: function(args) {
        return this.data;
    },

    /**
     * @return {function(Flow, *)}
     */
    getIteratorMethod: function() {
        return this.iteratorMethod;
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} args
     */
    executeIteration: function(args) {
        var _this = this;
        var iteration = new Iteration(this.getIteratorMethod());
        iteration.execute(args, function(throwable) {
            _this.iterationCallback(args, throwable);
        })
    },


    //-------------------------------------------------------------------------------
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {Array.<*>} args
     * @param {Throwable} throwable
     */
    iterationCallback: function(args, throwable) {

    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.IteratorFlow', IteratorFlow);

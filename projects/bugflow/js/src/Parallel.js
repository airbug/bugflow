//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.Parallel')

//@Require('Class')
//@Require('bugflow.ParallelException')
//@Require('bugflow.Flow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Flow                = bugpack.require('bugflow.Flow');
var ParallelException   = bugpack.require('bugflow.ParallelException');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Parallel = Class.extend(Flow, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(flowArray) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ParallelException}
         */
        this.exception          = null;

        /**
         * @private
         * @type {Array<Flow>}
         */
        this.flowArray          = flowArray;

        /**
         * @private
         * @type {number}
         */
        this.numberComplete     = 0;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} args
     */
    executeFlow: function(args) {
        this._super(args);
        var _this = this;
        if (this.flowArray.length > 0) {
            this.flowArray.forEach(function(flow) {
                flow.execute(args, function(error) {
                    _this.flowCallback(error);
                });
            });
        } else {
            this.complete();
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Throwable} throwable
     */
    processThrowable: function(throwable) {
        if (!this.exception) {
            this.exception = new ParallelException();
        }
        this.exception.addCause(throwable);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Throwable} throwable
     */
    flowCallback: function(throwable) {
        this.numberComplete++;
        if (throwable) {
            this.processThrowable(throwable);
        }
        if (this.numberComplete >= this.flowArray.length) {
            if (!this.exception) {
                this.complete();
            } else {
                this.error(this.exception);
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.Parallel', Parallel);

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.Series')

//@Require('Class')
//@Require('bugflow.Flow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Flow =  bugpack.require('bugflow.Flow');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Series = Class.extend(Flow, {

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
         * @type {Array<*>}
         */
        this.execArgs = null;

        /**
         * @private
         * @type {*}
         */
        this.flowArray = flowArray;

        /**
         * @private
         * @type {number}
         */
        this.index = -1;
    },


    //-------------------------------------------------------------------------------
    // Flow Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} args
     */
    executeFlow: function(args) {
        this._super(args);
        this.execArgs = args;
        this.startNextFlow();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    startNextFlow: function() {
        var _this = this;
        this.index++;
        if (this.index < this.flowArray.length) {
            var nextFlow = this.flowArray[this.index];
            nextFlow.execute(this.execArgs, function(error) {
                _this.flowCallback(error);
            });
        } else {
            this.complete();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Error} error
     */
    flowCallback: function(error) {
        if (error) {
            this.error(error);
        } else  {
            this.startNextFlow();
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.Series', Series);

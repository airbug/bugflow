//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.FlowBuilder')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil     = bugpack.require('ArgUtil');
var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var FlowBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(flowClass, flowConstructorArgs) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Class}
         */
        this.flowClass              = flowClass;

        /**
         * @private
         * @type {Array.<*>}
         */
        this.flowConstructorArgs    = flowConstructorArgs;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array.<*>}
     */
    getFlowConstructorArgs: function() {
        return this.flowConstructorArgs;
    },

    /**
     * @return {Class}
     */
    getFlowClass: function() {
        return this.flowClass;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(Array.<*> | function(Throwable=))} flowArgs
     * @param {function(Throwable=)=} callback
     */
    execute: function(flowArgs, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "flowArgs", optional: true, type: "array", default: []},
            {name: "callback", optional: false, type: "function"}
        ]);
        flowArgs    = args.flowArgs;
        callback    = args.callback;
        var flow    = this.flowClass.create(this.flowConstructorArgs);
        flow.execute(flowArgs, callback);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.FlowBuilder', FlowBuilder);

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.IfBuilder')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('List')
//@Require('bugflow.FlowBuilder')
//@Require('bugflow.If')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var List                = bugpack.require('List');
var FlowBuilder         = bugpack.require('bugflow.FlowBuilder');
var If                  = bugpack.require('bugflow.If');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IfBuilder = Class.extend(FlowBuilder, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(flowClass, flowConstructorArgs) {

        this._super(flowClass, flowConstructorArgs);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Flow}
         */
        this.elseFlow       = null;

        /**
         * @private
         * @type {List.<IfBuilder>}
         */
        this.elseIfList     = new List();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Flow}
     */
    getElseFlow: function() {
        return this.elseFlow;
    },

    /**
     * @return {List.<IfBuilder>}
     */
    getElseIfList: function() {
        return this.elseIfList;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function()} ifMethod
     * @param {Flow} elseIfFlow
     * @return {IfBuilder}
     */
    $elseIf: function(ifMethod, elseIfFlow) {
        if (this.elseFlow) {
            throw new Bug("IllegalState", {}, "IfFlow already has an ElseFlow");
        }
        var ifFlow = new IfBuilder(If, [ifMethod, elseIfFlow]);
        this.elseIfList.add(ifFlow);
        return this;
    },

    /**
     * @param {Flow} elseFlow
     * @return {IfBuilder}
     */
    $else: function(elseFlow) {
        if (this.elseFlow) {
            throw new Bug("IllegalState", {}, "IfFlow already has an ElseFlow");
        }
        this.elseFlow = elseFlow;
        return this;
    },

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
        var flow    = this.getFlowClass().create(this.getFlowConstructorArgs());
        flow.addAllElseIf(this.elseIfList);
        flow.setElse(this.elseFlow);
        flow.execute(flowArgs, callback);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.IfBuilder', IfBuilder);

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.MappedParallelException')

//@Require('Class')
//@Require('Map')
//@Require('StackTraceUtil')
//@Require('bugflow.ParallelException')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var StackTraceUtil      = bugpack.require('StackTraceUtil');
var ParallelException   = bugpack.require('bugflow.ParallelException');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MappedParallelException = Class.extend(ParallelException, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(type, data, message) {

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<*, Throwable>}
         */
        this.causeMap   = new Map();

        type = type ? type : "MappedParallelException";
        this._super(type, data, message);
    },


    //-------------------------------------------------------------------------------
    // Throwable  Overrides
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<Throwable>}
     */
    getCauses: function() {
        return this.causeMap.getValueArray();
    },

    /**
     * @return {Map.<*, Throwable>}
     */
    getCauseMap: function() {
        return this.causeMap;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Extension
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        var data = this._super();
        data.causeMap   = this.causeMap;
        return data;
    },

    toString: function() {
        var data = this._super();
        data = data + "\n causeMap:" + this.causeMap.toString();
        return data
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} key
     * @param {Throwable} throwable
     */
    putCause: function(key, throwable) {
        this.causeMap.put(key, throwable);
        this.buildStackTrace();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @private
     */
    buildStackTrace: function() {
        var _this = this;
        if (!this.primaryStack) {
            this.primaryStack = this.generateStackTrace();
        }
        var stack = this.primaryStack;
        stack += "\n\n";
        stack += this.type + " was caused by " + this.causeMap.getCount() + " exceptions:\n";
        var count = 0;
        this.causeMap.forEach(function(cause, key) {
            count++;
            stack += _this.type + " cause mapped to '" + key + "':\n";
            stack += cause.message + "\n";
            stack += cause.stack;
        });
        this.stack = stack;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugflow.MappedParallelException', MappedParallelException);
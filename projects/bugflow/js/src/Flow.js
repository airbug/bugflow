//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.Flow')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil     = bugpack.require('ArgUtil');
var Bug         = bugpack.require('Bug');
var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');
var BugTrace    = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $error      = BugTrace.$error;
var $trace      = BugTrace.$trace;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Flow = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Throwable=)}
         */
        this.callback       = null;

        /**
         * @private
         * @type {boolean}
         */
        this.completed      = false;

        /**
         * @private
         * @type {boolean}
         */
        this.errored        = false;

        /**
         * @private
         * @type {boolean}
         */
        this.executed       = false;

        /**
         * @private
         * @type {Throwable}
         */
        this.throwable      = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    hasCompleted: function() {
        return this.completed;
    },

    /**
     * @return {boolean}
     */
    hasExecuted: function() {
        return this.executed;
    },

    /**
     * @return {boolean}
     */
    hasErrored: function() {
        return this.errored;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Throwable=} throwable
     * @param {...*} var_args
     */
    complete: function(throwable) {
        var _this = this;
        if (throwable) {
            this.error(throwable);
        } else {
            var args = ArgUtil.toArray(arguments);
            if (this.hasErrored()) {
                this.throwBug(new Bug("DuplicateFlow", {}, "Cannot complete flow. Flow has already errored out."));
            }
            if (this.hasCompleted()) {
                this.throwBug(new Bug("DuplicateFlow", {}, "Can only complete a flow once."));
            }
            _this.completeFlow(args);
        }
    },

    /**
     * @param {Throwable} throwable
     */
    error: function(throwable) {
        if (this.hasErrored()) {
            this.throwBug(new Bug("DuplicateFlow", {}, "Can only error flow once.", [throwable]));
        }
        if (this.hasCompleted()) {
            this.throwBug(new Bug("DuplicateFlow", {}, "Cannot error flow. Flow has already completed.", [throwable]));
        }
        this.errorFlow($error(throwable));
    },

    /**
     * @param {(Array.<*> | function(Throwable=))} args
     * @param {function(Throwable=)=} callback
     */
    execute: function(args, callback) {
        if (TypeUtil.isFunction(args)) {
            callback = args;
            args = [];
        }
        this.callback = callback;
        if (!this.executed) {
            try {
                this.executeFlow(args);
            } catch(throwable) {
                this.error(throwable);
            }
        } else {
            throw new Bug("IllegalState", {}, "A flow can only be executed once.");
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param  {Array.<*>} args
     */
    completeFlow: function(args) {
        var _this = this;
        this.completed = true;
        if (this.callback) {
            //setTimeout($trace(function() {
                _this.callback.apply(this, args);
           // }), 0);
        }
    },

    /**
     * @protected
     * @param {Throwable} throwable
     */
    errorFlow: function(throwable) {
        this.errored    = true;
        this.throwable  = throwable;
        if (this.callback) {
            this.callback(throwable);
        } else {
            throw throwable;
        }
    },

    /**
     * @protected
     * @param {Array.<*>} args
     */
    executeFlow: function(args) {
        this.executed = true;
    },

    /**
     * @protected
     * @param {Bug} bug
     */
    throwBug: function(bug) {
        if (this.throwable) {
            bug.addCause(this.throwable);
        }
        throw bug;
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugflow.Flow', Flow);

/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 * 
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.Task')

//@Require('Class')
//@Require('bugflow.Flow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Flow        = bugpack.require('bugflow.Flow');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var Task = Class.extend(Flow, {

        _name: "bugflow.Task",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Flow)}  taskMethod
         * @param {Object} taskContext
         */
        _constructor: function(taskMethod, taskContext) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Object}
             */
            this.taskContext    = taskContext;

            /**
             * @private
             * @type {function(Flow)}
             */
            this.taskMethod     = taskMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getTaskContext: function() {
            return this.taskContext;
        },

        /**
         * @return {function(Flow)}
         */
        getTaskMethod: function() {
            return this.taskMethod;
        },


        //-------------------------------------------------------------------------------
        // Flow Extensions
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            this.taskMethod.apply(this.taskContext, ([this]).concat(args));
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugflow.Task', Task);
});

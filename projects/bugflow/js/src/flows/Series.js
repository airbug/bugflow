/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugflow.Series')

//@Require('Class')
//@Require('bugflow.Flow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Flow    = bugpack.require('bugflow.Flow');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {flow}
     */
    var Series = Class.extend(Flow, {

        _name: "bugflow.Series",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Array.<Flow>} flowArray
         */
        _constructor: function(flowArray) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<*>}
             */
            this.execArgs    = null;

            /**
             * @private
             * @type {Array.<Flow>}
             */
            this.flowArray  = flowArray;

            /**
             * @private
             * @type {number}
             */
            this.index      = -1;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
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
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugflow.Series', Series);
});

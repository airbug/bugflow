//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

(function(window) {
    var bugpack     = require("bugpack").context();
    var BugFlow     = bugpack.require("bugflow.BugFlow");
    window.bugflow = window.bugflow || BugFlow;
})(window);

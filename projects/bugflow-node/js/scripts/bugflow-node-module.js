/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 * 
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var bugpackApi  = require("bugpack");
var bugpack     = bugpackApi.loadContextSync(module);
bugpack.loadExportSync("bugflow.BugFlow");
var BugFlow     = bugpack.require("bugflow.BugFlow");


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

module.exports = BugFlow;

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugcore             = require('bugcore');
var bugflow             = require('bugflow');
var bugfs               = require('bugfs');
var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var enableModule        = buildbug.enableModule;
var TypeUtil            = bugcore.TypeUtil;
var $series             = bugflow.$series;
var $task               = bugflow.$task;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var lintbug             = enableModule("lintbug");


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

//NOTE BRN: This only works for JS files
lintbug.lintTask("updateCopyright", function(lintFile, callback) {
    var fileContents    = lintFile.getFileContents();
    var copyright       = getCopyright();
    var copyrightRegex  = /^(\s*)\/\*(([^.]|[.])+?)Copyright \(c\)(([^.]|[.])+?)\*\/(\s*)/;
    fileContents = fileContents.replace(copyrightRegex, copyright + "\n\n");
    lintFile.setFileContents(fileContents);
    callback();
});


//-------------------------------------------------------------------------------
// Helper Methods
//-------------------------------------------------------------------------------

var copyright = null;
var getCopyright = function() {
    if (copyright === null) {
        var copyrightText   = bugfs.readFileSync(__dirname + "/COPYRIGHT", 'utf8');
        var copyrightLines  = copyrightText.split("\n");
        copyright = "/*\n * " + copyrightLines.join("\n * ") + "\n */\n";
    }
    return copyright;
};

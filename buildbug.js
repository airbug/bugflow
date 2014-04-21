//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject        = buildbug.buildProject;
var buildProperties     = buildbug.buildProperties;
var buildTarget         = buildbug.buildTarget;
var enableModule        = buildbug.enableModule;
var parallel            = buildbug.parallel;
var series              = buildbug.series;
var targetTask          = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var aws                 = enableModule("aws");
var bugpack             = enableModule('bugpack');
var bugunit             = enableModule('bugunit');
var core                = enableModule('core');
var nodejs              = enableModule('nodejs');
var uglifyjs            = enableModule("uglifyjs");


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var name                = "bugflow";
var version             = "0.1.3";
var dependencies        = {
    bugpack: "0.1.12"
};


//-------------------------------------------------------------------------------
// BuildProperties
//-------------------------------------------------------------------------------

buildProperties({
    node: {
        packageJson: {
            name: name,
            version: version,
            description: "Declarative async flow control for object oriented JavaScript provided by the bugcore library",
            main: "./scripts/bugflow-node-module.js",
            dependencies: dependencies,
            author: "Brian Neisler <brian@airbug.com>",
            repository: {
                type: "git",
                url: "https://github.com/airbug/bugflow.git"
            },
            bugs: {
                url: "https://github.com/airbug/bugflow/issues"
            },
            licenses: [
                {
                    type : "MIT",
                    url : "https://raw.githubusercontent.com/airbug/bugflow/master/LICENSE"
                }
            ]
        },
        sourcePaths: [
            "../bugcore/projects/bugcore/js/src",
            "../bugtrace/projects/bugtrace/js/src",
            "./projects/bugflow/js/src"
        ],
        scriptPaths: [
            "./projects/bugflow-node/js/scripts"
        ],
        readmePath: "./README.md",
        unitTest: {
            packageJson: {
                name: name + "-test",
                version: version,
                main: "./scripts/bugflow-node-module.js",
                dependencies: dependencies,
                scripts: {
                    test: "./scripts/bugunit-run.js"
                }
            },
            sourcePaths: [
                "../buganno/projects/buganno/js/src",
                "../bugfs/projects/bugfs/js/src",
                "../bugjs/projects/bugyarn/js/src",
                "../bugmeta/projects/bugmeta/js/src",
                "../bugunit/projects/bugdouble/js/src",
                "../bugunit/projects/bugunit/js/src"
            ],
            scriptPaths: [
                "../buganno/projects/buganno/js/scripts",
                "../bugunit/projects/bugunit/js/scripts"
            ],
            testPaths: [
                "../bugcore/projects/bugcore/js/test",
                "../bugtrace/projects/bugtrace/js/test",
                "./projects/bugflow/js/test"
            ]
        }
    },
    web: {
        buildPath: buildProject.getProperty("buildPath") + "/web",
        name: name,
        version: version,
        sourcePaths: [
            "../bugcore/projects/bugcore/js/src",
            "../bugtrace/projects/bugtrace/js/src",
            "./projects/bugflow/js/src"
        ],
        outputFile: "{{distPath}}/{{web.name}}-{{web.version}}.js",
        outputMinFile: "{{distPath}}/{{web.name}}-{{web.version}}.min.js"
    }
});


//-------------------------------------------------------------------------------
// BuildTargets
//-------------------------------------------------------------------------------

// Clean BuildTarget
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);


// Local BuildTarget
//-------------------------------------------------------------------------------

buildTarget('local').buildFlow(
    series([
        targetTask('clean'),
        parallel([
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("node.packageJson"),
                        readmePath: buildProject.getProperty("node.readmePath"),
                        sourcePaths: buildProject.getProperty("node.sourcePaths").concat(
                            buildProject.getProperty("node.unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("node.scriptPaths").concat(
                            buildProject.getProperty("node.unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("node.unitTest.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{node.packageJson.name}}",
                        packageVersion: "{{node.packageJson.version}}"
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                            //checkCoverage: true
                        });
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{local-bucket}}"
                    }
                })
            ]),
            series([
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("web.sourcePaths"),
                        intoPath: "{{web.buildPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        name: "{{web.name}}",
                        sourceRoot: "{{web.buildPath}}"
                    }
                }),
                targetTask("concat", {
                    init: function(task, buildProject, properties) {
                        var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("web.name"));
                        var sources         = [];
                        var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                        registryEntries.forEach(function(bugPackRegistryEntry) {
                            sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                        });
                        task.updateProperties({
                            sources: sources.concat("./projects/bugflow-web/js/scripts/bugflow-web.js")
                        });
                    },
                    properties: {
                        outputFile: "{{web.outputFile}}"
                    }
                }),
                parallel([
                    targetTask("s3PutFile", {
                        properties: {
                            file:  "{{web.outputFile}}",
                            options: {
                                acl: 'public-read',
                                gzip: true
                            },
                            bucket: "{{local-bucket}}"
                        }
                    }),
                    series([
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{web.outputFile}}"],
                                outputFile: "{{web.outputMinFile}}"
                            }
                        }),
                        targetTask("s3PutFile", {
                            properties: {
                                file:  "{{web.outputMinFile}}",
                                options: {
                                    acl: 'public-read',
                                    gzip: true
                                },
                                bucket: "{{local-bucket}}"
                            }
                        })
                    ])
                ])
            ])
        ])
    ])
).makeDefault();


// Prod BuildTarget
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
    series([
        targetTask('clean'),
        parallel([

            //Create test node bugflow package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("node.unitTest.packageJson"),
                        sourcePaths: buildProject.getProperty("node.sourcePaths").concat(
                            buildProject.getProperty("node.unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("node.scriptPaths").concat(
                            buildProject.getProperty("node.unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("node.unitTest.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("node.unitTest.packageJson.name"),
                            buildProject.getProperty("node.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{node.unitTest.packageJson.name}}",
                        packageVersion: "{{node.unitTest.packageJson.version}}"
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("node.unitTest.packageJson.name"),
                            buildProject.getProperty("node.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath(),
                            checkCoverage: true
                        });
                    }
                })
            ]),

            // Create production node bugflow package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("node.packageJson"),
                        readmePath: buildProject.getProperty("node.readmePath"),
                        sourcePaths: buildProject.getProperty("node.sourcePaths"),
                        scriptPaths: buildProject.getProperty("node.scriptPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: "{{node.packageJson.name}}",
                        packageVersion: "{{node.packageJson.version}}"
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("node.packageJson.name"),
                            buildProject.getProperty("node.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{public-bucket}}"
                    }
                }),
                targetTask('npmConfigSet', {
                    properties: {
                        config: buildProject.getProperty("npmConfig")
                    }
                }),
                targetTask('npmAddUser'),
                targetTask('publishNodePackage', {
                    properties: {
                        packageName: "{{node.packageJson.name}}",
                        packageVersion: "{{node.packageJson.version}}"
                    }
                })
            ]),


            series([
                targetTask('copyContents', {
                    properties: {
                        fromPaths: buildProject.getProperty("web.sourcePaths"),
                        intoPath: "{{web.buildPath}}"
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    properties: {
                        name: "{{web.name}}",
                        sourceRoot: "{{web.buildPath}}"
                    }
                }),
                targetTask("concat", {
                    init: function(task, buildProject, properties) {
                        var bugpackRegistry = bugpack.findBugPackRegistry(buildProject.getProperty("web.name"));
                        var sources         = [];
                        var registryEntries = bugpackRegistry.getRegistryEntriesInDependentOrder();

                        registryEntries.forEach(function(bugPackRegistryEntry) {
                            sources.push(bugPackRegistryEntry.getResolvedPath().getAbsolutePath());
                        });
                        task.updateProperties({
                            sources: sources.concat("./projects/bugflow-web/js/scripts/bugflow-web.js")
                        });
                    },
                    properties: {
                        outputFile: "{{web.outputFile}}"
                    }
                }),
                parallel([
                    targetTask("s3PutFile", {
                        properties: {
                            file:  "{{web.outputFile}}",
                            options: {
                                acl: 'public-read',
                                gzip: true,
                                cacheControl: "max-age=31536000, public"
                            },
                            bucket: "{{public-bucket}}"
                        }
                    }),
                    series([
                        targetTask("uglifyjsMinify", {
                            properties: {
                                sources: ["{{web.outputFile}}"],
                                outputFile: "{{web.outputMinFile}}"
                            }
                        }),
                        targetTask("s3PutFile", {
                            properties: {
                                file:  "{{web.outputMinFile}}",
                                options: {
                                    acl: 'public-read',
                                    gzip: true,
                                    cacheControl: "max-age=31536000, public"
                                },
                                bucket: "{{public-bucket}}"
                            }
                        })
                    ])
                ])
            ])
        ])
    ])
);

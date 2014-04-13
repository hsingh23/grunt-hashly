/* globals module */

module.exports = function (grunt) {
    var config = {
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            uses_defaults: ["gruntfile.js", "./lib/**/*.js"],
            with_overrides: {
                options: {
                    jshintrc: "test/.jshintrc"
                },
                files: {
                    src: ["test/**/*.js"]
                }
            },
            options: {
                jshintrc: ".jshintrc"
            }
        },
        mochaTest: {
            all: {
                src: ["./test/**/*.unittests.js"]
            },
            options: {
                reporter: "Spec",
                timeout: 20000
            }
        },
        jsbeautifier: {
            all: {
                src: ["gruntfile.js", "./lib/**/*.js", "./test/**/*.js"],
                options: {
                    js: {
                        jslintHappy: true
                    }
                }
            }
        },
        lineending: {
            all: {
                files: [{
                    expand: true,
                    cwd: "./lib/",
                    src: ["./**/*.js"],
                    dest: "./lib/"
                }, {
                    expand: true,
                    cwd: "./test/",
                    src: ["./**/*.js"],
                    dest: "./test/"
                }],
                options: {
                    eol: "crlf"
                }
            }
        },
        hashly: {
            basePathMissing: {},
            basePathDoesntExist: {
                basePath: "./assets-doesnt-exist"
            },
            basePathIsFile: {
                basePath: "./assets/alreadyBusted.css"
            },
            inPlace: {
                basePath: "./assets/"
            },
            inPlaceExplicit: {
                files: "./assets/**/*",
                basePath: "./assets/"
            },
            inPlaceFilter: {
                files: "./assets/**/*.js",
                basePath: "./assets/"
            },
            inPlaceClean: {
                basePath: "./assets/",
                clean: true
            },
            altDist: {
                files: "./assets/**/*",
                basePath: "./assets/",
                targetPath: "./assetsDist/"
            }
        },
        clean: {
            assetsDist: ["./assetsDist/"]
        }
    };

    // Project configuration.
    grunt.initConfig(config);

    // NPM tasks
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-lineending");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.loadTasks("./tasks/");

    grunt.registerTask("travis", "default");

    grunt.registerTask("default", ["jshint", "mochaTest"]);

    grunt.registerTask("beautify", ["jsbeautifier", "lineending"]);
};
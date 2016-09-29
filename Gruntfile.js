/**!
 * Allmobilize Model - Gruntfile
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            lib: {
                src: 'lib/**/*.js'
            },
            index: {
                src: 'index.js'
            },
            Gruntfile: {
                src: 'Gruntfile.js'
            },
            testjs: {
                src: 'test/**/*.js'
            }
        },
        jsbeautifier: {
            "default": {
                src: [
                    '*.js',
                    'lib/**/*.js',
                    'test/**/*.js'
                ],
                options: {
                    js: {
                        braceStyle: "collapse",
                        breakChainedMethods: false,
                        e4x: false,
                        evalCode: false,
                        indentChar: " ",
                        indentLevel: 0,
                        indentSize: 4,
                        indentWithTabs: false,
                        jslintHappy: false,
                        keepArrayIndentation: false,
                        keepFunctionIndentation: false,
                        maxPreserveNewlines: 10,
                        preserveNewlines: true,
                        spaceBeforeConditional: true,
                        spaceInParen: false,
                        unescapeStrings: false,
                        wrapLineLength: 0
                    }
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    run: true,
                    log: true,
                    bail: true,
                },
                src: ['test/**/*.test.js'],
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Default task.
    grunt.registerTask('test', ['jshint', 'mochaTest']);

    grunt.registerTask('default', ['jshint', 'jsbeautifier', 'mochaTest']);
};

module.exports = function (grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            // dist: {
            //	files : [{
            //		src: 'src/**/*.js',
            //		dest: 'dest/main.js',
            //	}]
            // },
            MinifyAllTarget: {
                files: {
                    'output.min.js': ['helpers/*.js',
                        'directives/*.js',
                        'services/*.js',
                        'filters/*.js',
                        'controllers/*.js']
                }
            },
            options: {
                exportAll: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }

            /* build: {
             src: 'src/Samplesccript.js',
             dest: 'build/Samplesccript.min.js'
             } */
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
};
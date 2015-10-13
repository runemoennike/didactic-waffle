module.exports = function (grunt) {

    grunt.initConfig({
        mkdir: {
            dev: {
                options: {
                    create: [
                        'client/dist',
                    ]
                }
            }
        },
        clean: [
            'client/dist'
        ],
        copy: {
            css: {
                expand: true,
                flatten: true,
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/font-awesome/css/font-awesome.min.css',
                    'node_modules/angular-datepicker/dist/index.min.css',
                    'node_modules/ng-tags-input/build/ng-tags-input.bootstrap.min.css',
                    'node_modules/ng-tags-input/build/ng-tags-input.min.css',
                ],
                dest: 'client/dist/css/'
            },
            js: {
                expand: true,
                flatten: true,
                src: [
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/angular/angular.min.js',
                    'node_modules/angular-route/angular-route.min.js',
                    'node_modules/angular-datepicker/dist/index.min.js',
                    'node_modules/angular-socket-io/socket.min.js',
                    'node_modules/socket.io-client/socket.io.js',
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/ng-tags-input/build/ng-tags-input.min.js',
                    'node_modules/underscore/underscore-min.js',
                    'node_modules/d3/d3.min.js',
                ],
                dest: 'client/dist/js'
            },
            fonts: {
                expand: true,
                flatten: true,
                src: [
                    'node_modules/font-awesome/fonts/*',
                ],
                dest: 'client/dist/fonts/'
            }
        },
        rename: {
            // The developer of angular-datepicker chose to name his dist files index.js/index.css...
            angulardatepicker: {
                files: [
                    {src: 'client/dist/js/index.min.js', dest: 'client/dist/js/angular-datepicker.min.js'},
                    {src: 'client/dist/css/index.min.css', dest: 'client/dist/css/angular-datepicker.min.css'},
                ]
            }
        },
        concat: {
            app: {
                src: [
                    'client/src/**/*.module.js',
                    'client/src/**/*.js'
                ],
                dest: 'client/dist/js/src.js'
            }
        },
        less: {
            app: {
                src: ['client/src/app.less'],
                dest: 'client/dist/css/app.css'
            }
        },
        watch: {
            dev: {
                files: [
                    'client/index.html',
                    'client/src/**/*.js',
                    'client/src/**/*.less'
                ],
                tasks: ['build-dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-rename');

    grunt.registerTask('default', ['build-dev']);
    grunt.registerTask('build-dev', ['clean', 'mkdir:dev', 'copy', 'rename', 'concat:app', 'less:app'])
};
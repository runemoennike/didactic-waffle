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
            dev: {
                expand: true,
                flatten: true,
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',

                    'node_modules/angular/angular.min.js',
                    'node_modules/angular-route/angular-route.min.js',

                    'node_modules/jquery/dist/jquery.min.js',
                ],
                dest: 'client/dist/'
            }
        },
        concat: {
            app: {
                src: [
                    'client/src/**/*.module.js',
                    'client/src/**/*.js'
                ],
                dest: 'client/dist/src.js'
            }
        },
        watch: {
            dev: {
                files: [
                    'client/index.html',
                    'client/src/**/*.js'
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

    grunt.registerTask('default', ['build-dev']);
    grunt.registerTask('build-dev', ['clean', 'mkdir:dev', 'copy:dev', 'concat:app'])
};
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'env': {
            'dev': {
                'src': 'env-dev.ini'
            }
        },

        'jshint': {
            'lint': {
                'options': {
                    'jshintrc': '.jshintrc',
                    'reporter': require('jshint-stylish')
                },
                'src': [
                    'index.js',
                    'lib/**/*.js',
                    'cli.js',
                    'test/**/*.js'
                ]
            }
        },

        'mocha_istanbul': {
            'coverage': {
                'src': 'test',
                'options': {
                    'print': 'detail',
                    'reporter': 'spec'
                }
            }
        },

        'coveralls': {
            'options': {
                // LCOV coverage file relevant to every target
                'src': 'coverage/lcov.info',

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                'force': true
            },
            'node-mcrcon': 'coverage/lcov.info'
        },

        'shell': {
            'lambda-zip' : {
                'command': [
                    'rm -f dyndup.zip ',
                    'zip dyndup.zip dyndup.js lib/aws-route53-rrs.js'
                ].join('&&')
            },
            'lambda-upload' : {
                'command': 'aws lambda upload-function \
                            --function-name dyndup \
                            --function-zip dyndup.zip \
                            --role arn:aws:iam::402526837177:role/dyndup-role \
                            --mode event \
                            --handler dyndup.handler \
                            --runtime nodejs'
            },
            'lambda-test': {
                'command': 'aws lambda invoke-async --debug --function-name dyndup --invoke-args ./dyndup.event'
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.registerTask('test', ['env:dev', 'jshint', 'mocha_istanbul', 'coveralls']);

    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('lambda-install', ['env:dev', 'shell:lambda-zip', 'shell:lambda-upload']);
};

/* global module:false */
module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var mozjpeg = require('imagemin-mozjpeg');
    var sass = require('node-sass');

    grunt.initConfig({

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.src/sass',
                    src: ['**/*.scss'],
                    dest: '.src/css',
                    rename: function (dest, src) {
                        var folder = src.substring(0, src.lastIndexOf('/')),
                            filename = src.substring(src.lastIndexOf('/'), src.length);
                        filename = filename.substring(0, filename.lastIndexOf('.'));
                        return dest + '/' + folder + filename + '.css';
                    }
                }],
                options: {
                    sourcemap: true,
                    style: 'nested',
                    implementation: sass
                }
            }
        },

        replace: {
            dist: {
                src: ['.src/css/a11yclub-teaser.min.css'],
                overwrite: true,
                replacements: [{
                    from: /[\t\r\n]+/g,
                    to: ''
                }, {
                    from: /<link rel="shortcut icon".*/g,
                    to: '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/><link rel="icon" href="favicon.ico" type="image/x-icon"/>'
                }]
            }

        },

        autoprefixer: {
            options: {
                browsers: ['last 3 versions', 'ie 8']
            },
            dist: {
                expand: true,
                flatten: true,
                src: '.src/css/*.css',
                dest: '.src/css/'
            }
        },

        cssmin: {
            dist: {
                expand: true,
                cwd: '.src/css/',
                src: ['*.css', '!*.min.css'],
                dest: '.src/css/',
                ext: '.min.css'
            }
        },

        favicons: {
            options: {
                html: '.src/logo/favicons.html',
                HTMLPrefix: '/icns/',
                precomposed: false,
                firefox: true,
                firefoxManifest: 'public/icns/a11yclub-teaser.webapp',
                appleTouchBackgroundColor: '#222222'
            },
            icons: {
                src: '.src/logo/a11yclub-logo.png',
                dest: 'public/icns/'
            }
        },

        copy: {
            favicon: {
                src: 'public/icns/favicon.ico',
                dest: 'public/favicon.ico'
            }
        },

        clean: {
            dist: ['.src/css/a11yclub-teaser.css', '.src/css/a11yclub-teaser.min.css', '.src/css/a11yclub-teaser-print.css', '.src/css/a11yclub-teaser-print.min.css'],
            favicon: ['public/favicon.ico'],
        },

        'string-replace': {
            dist: {
                files: {
                    'public/index.html': '.src/html/index.html',
                },
                options: {
                    replacements: [
                        {
                            pattern: '<link media="all" href="a11yclub-teaser.css" rel="stylesheet"/>',
                            replacement: '<style media="all"><%= grunt.file.read(".src/css/a11yclub-teaser.min.css") %></style>'
                        },
                        {
                            pattern: '<link media="print" href="a11yclub-teaser-print.css" rel="stylesheet"/>',
                            replacement: '<style media="print"><%= grunt.file.read(".src/css/a11yclub-teaser-print.min.css") %></style>'
                        },
                        {
                            pattern: '<!-- favicon -->',
                            replacement: '<%= grunt.file.read(".src/logo/favicons.html") %>'
                        }
                    ]
                }
            }
        },

        replace: {
            favicon: {
                src: ['public/icons/favicons.html'],
                overwrite: true,
                replacements: [{
                    from: /[\t\r\n]+/g,
                    to: ''
                }, {
                    from: /<link rel="shortcut icon".*/g,
                    to: '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/><link rel="icon" href="favicon.ico" type="image/x-icon"/>'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'public/index.html': 'public/index.html',
                }
            },
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: '.src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/img/'
                }]
            }
        },

        uglify: {
            dist: {
                files: {
                    'public/js/a11yclub-teaser.min.js': ['.src/js/actions.js', '.src/js/slider.js']
                }
            }
        },

        watch: {
            sass: {
                files: '.src/sass/**/*.scss',
                tasks: ['css']
            },
            html: {
                files: '.src/html/**/*.html',
                tasks: ['html']
            },
            js: {
                files: '.src/js/**/*.js',
                tasks: ['js']
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['css']);
    grunt.registerTask('images', ['imagemin']);
    grunt.registerTask('css', ['clean', 'sass', 'autoprefixer', 'cssmin', 'html']);
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('html', ['string-replace', 'htmlmin']);
    grunt.registerTask('favicon', ['clean:favicon', 'favicons', 'copy:favicon', 'replace:favicon', 'html']);
};

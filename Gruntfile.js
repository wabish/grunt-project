module.exports = function(grunt) {

    /**
	 *
     * 构建目标：
     * （1）图片优化，雪碧图，图片hash
     * （2）sass编译，css压缩合并，css文件hash
     * （3）js检错，js压缩合并，js文件hash
     * （4）RequireJs打包
     *
     * 开发步骤：
     * （1）sass编译
     * （2）js检错
     * （3）watch监控文件
     *
     * 上线步骤：
     * （1）删除dist文件夹
     * （2）生成雪碧图至tmp/sprite目录下，并压缩图片至tmp/images目录下，最后hash至dist/images目录下
     * （3）css压缩合并至tmp/css目录下，替换css里面已hash的图片路径，最后将css文件hash至dist/css目录下
     * （4）js依赖压缩合并至tmp/js目录下，替换js里已hash的静态文件路径，最后将js文件hash至dist/js目录下
     * （5）将html里的php include替换后放至于tmp/view目录下，复制粘贴include的html文件
     * （6）替换tmp目录下html里已hash的静态文件，最后将html压缩至dist/view目录下
     * （7）tmp是临时文件夹，删除
     * （8）bootstrap.php里搜索PATH_PAGE_VIEW_NEW，src改成dist
     *
     */

    // 载入任务
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // 任务配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        // 雪碧图
        sprite: {
            options: {
                imagepath: '<%= pkg.path.dev %>images/mod/',
                spritedest: '<%= pkg.path.tmp %>images/mod/',
                padding: 2
            },
            mod: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.dev %>css/mod/',
                    src: '*.css',
                    dest: '<%= pkg.path.tmp %>sass/mod/'
                }]
            }
        },

        // 压缩图片
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.tmp %>images/',
                    src: ['**/*.{png,gif,jpg,jpeg}'],
                    dest: '<%= pkg.path.tmp %>images/'
                }]
            }
        },

        // 编译sass
        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.src %>sass/',
                    src: ['page/*.scss'],
                    dest: '<%= pkg.path.dist %>css/',
                    ext: '.css'
                }]
            },
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.tmp %>sass/',
                    src: ['**/*.css'],
                    dest: '<%= pkg.path.tmp %>css/',
                    ext: '.css'
                }]
            }
        },

        // requirejs打包
        requirejs: {
            options: {
                appDir: '<%= pkg.path.dev %>js',
                baseUrl: 'lib',
                mainConfigFile: '<%= pkg.path.dev %>js/config.js',
                dir: '<%= pkg.path.tmp %>js'
            },
            build: {
                options: {
                    optimize: 'uglify2',
                    // optimize: 'none',
                    paths: {
                        'login': '../mod/login',
                        'home': '../mod/home',
                        'payFirm': '../mod/payFirm',
                        'payInfo': '../mod/payInfo',
                        'payManage': '../mod/payManage',
                        'payProduct': '../mod/payProduct',
                        'payVerify': '../mod/payVerify',
                        'activeIndex': '../mod/activeIndex',
                        'activeSuccess': '../mod/activeSuccess'
                    },
                    modules: [{
                        name: 'login',
                        exclude: ['jquery']
                    },{
                        name: 'home',
                        exclude: ['jquery', 'artTemplate']
                    }, {
                        name: 'payFirm',
                        exclude: ['jquery', 'artTemplate']
                    }, {
                        name: 'payInfo',
                        exclude: ['jquery', 'artTemplate']
                    }, {
                        name: 'payManage',
                        exclude: ['jquery', 'artTemplate']
                    }, {
                        name: 'payProduct',
                        exclude: ['jquery', 'artTemplate']
                    }, {
                        name: 'payVerify',
                        exclude: ['jquery', 'placeholder']
                    }, {
                        name: 'activeIndex',
                        exclude: ['jquery']
                    }, {
                        name: 'activeSuccess',
                        exclude: ['jquery']
                    }]
                }
            }
        },

        // 复制
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.dev %>images/app/',
                    src: ['**/*.{png,gif,jpg,jpeg}'],
                    dest: '<%= pkg.path.tmp %>images/app/'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.dev %>js/lib',
                    src: ['**/*.js'],
                    dest: '<%= pkg.path.dist %>js/lib'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.tmp %>view/mod',
                    src: ['**/*.html'],
                    dest: '<%= pkg.path.dist %>view/mod'
                }]
            }
        },

        // js代码检错
        jshint: {
            options: {
                curly: true,
                newcap: true,
                eqeqeq: true,
                noarg: true,
                sub: true,
                undef: true,
                camelcase: true,
                freeze: true,
                quotmark: true,
                browser: true,
                devel: true,
                globals: {
                    PUBLIC: false,
                    escape: false,
                    unescape: false,
                    // grunt
                    module: false,
                    // jasmine
                    it: false,
                    xit: false,
                    describe: false,
                    xdescribe: false,
                    beforeEach: false,
                    afterEach: false,
                    expect: false,
                    spyOn: false,
                    // requireJs
                    define: false,
                    require: false,
                    requirejs: false
                }
            },
            files: {
                src: [
                    'Gruntfile.js',
                    '<%= pkg.path.dev %>js/**/*.js',
                    '!<%= pkg.path.dev %>js/config.js',
                    '!<%= pkg.path.dev %>js/lib/**/*.js'
                ]
            }
        },

        // html依赖替换
        includereplace: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.src %>html/page/',
                    src: ['*.html'],
                    dest: '<%= pkg.path.dist %>html/page/'
                }]
            }
        },

        // 文件名替换
        usemin: {
            options: {
                assetsDirs: [
                    '<%= pkg.path.dist %>images/*',
                    '<%= pkg.path.dist %>css/*',
                    '<%= pkg.path.dist %>js/*'
                ],
                patterns: {
                    js: [[/([\w-]+\.png)/, 'replace image in js']]
                }
            },
            css: '<%= pkg.path.tmp %>css/mod/**/*.css',
            js: '<%= pkg.path.tmp %>js/mod/**/*.js',
            html: '<%= pkg.path.tmp %>view/mod/**/*.html'
        },

        // 静态文件hash
        filerev: {
            img: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.tmp %>images/',
                    src: ['**/*.{png,gif,jpg,jpeg}'],
                    dest: '<%= pkg.path.dist %>images/'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.tmp %>css/',
                    src: ['**/*.css'],
                    dest: '<%= pkg.path.dist %>css/'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.tmp %>js/',
                    src: ['*.js', 'mod/**/*.js'],
                    dest: '<%= pkg.path.dist %>js/'
                }]
            }
        },

        // 删除文件
        clean: {
            dist: ['<%= pkg.path.dist %>'],
            tmp: ['<%= pkg.path.tmp %>']
        },

        // 文件监控
        // watch: {
        //     sass: {
        //         files: ['<%= pkg.path.dev %>sass/**/*.scss'],
        //         tasks: ['sass:dev']
        //     },
        //     js: {
        //         files: ['<%= pkg.path.dev %>js/**/*.js'],
        //         tasks: ['newer:jshint']
        //     },
        //     html: {
        //         files: ['<%= pkg.path.dev %>html/**/*.html'],
        //         tasks: ['newer:includereplace']
        //     },
        //     client: {
        //         options: {
        //             livereload: true
        //         },
        //         files: [
        //             '<%= pkg.path.dev %>css/**/*.css',
        //             '<%= pkg.path.dev %>js/**/*.js',
        //             '<%= pkg.path.dev %>html/**/*.html'
        //         ]
        //     }
        // }

        watch: {
            sass: {
                files: ['<%= pkg.path.src %>sass/**/*.scss'],
                tasks: ['sass:dev']
            },
            html: {
                files: ['<%= pkg.path.src %>html/**/*.html'],
                tasks: ['includereplace:dev']
            }
        }
    });

    // 开发使用
    grunt.registerTask('dev', [
        'clean:dist',
        'sass:dev',
        'includereplace:dev',
        'watch'
    ]);

    // 打包上线使用
    // 步骤一：对图片进行打包
    grunt.registerTask('img', [
        'clean:dist',
        'sprite',
        'copy:images',
        'imagemin',
        'filerev:img'
    ]);

    // 步骤二：对css进行打包
    grunt.registerTask('css', [
        'sass:dist',
        'usemin:css',
        'filerev:css'
    ]);

    // 步骤三：对js进行打包
    grunt.registerTask('js', [
        'requirejs',
        'usemin:js',
        'filerev:js',
        'copy:js'
    ]);

    // 步骤三：对html进行打包
    grunt.registerTask('html', [
        'replace:before',
        'includereplace',
        'usemin:html',
        'replace:after',
        'copy:html',
        'clean:tmp'
    ]);
};

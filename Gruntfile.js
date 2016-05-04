module.exports = function(grunt) {

    /**
	 *
     * 构建目标：
     * （1）图片优化，雪碧图，图片hash
     * （2）sass编译，css压缩合并，css文件hash
     * （3）js检错，js压缩合并，js文件hash
     * （4）RequireJs打包
     *
     * 开发命令：
     *  grunt dev
     *
     * 上线命令（需顺序执行）：
     *  grunt img
     *  grunt css
     *  grunt js
     *  grunt html
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
                imagepath: '<%= pkg.path.tmp %>images/sprite/',
                spritedest: '<%= pkg.path.tmp %>images/sprite/',
                padding: 2
            },
            mod: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.tmp %>css/page/',
                    src: '*.css',
                    dest: '<%= pkg.path.tmp %>css/page/'
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
            tmp: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.src %>sass/',
                    src: ['page/*.scss'],
                    dest: '<%= pkg.path.tmp %>css/',
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
                    cwd: '<%= pkg.path.tmp %>css/',
                    src: ['**/*.css'],
                    dest: '<%= pkg.path.tmp %>css/',
                    ext: '.css'
                }]
            }
        },

        // requirejs打包
        requirejs: {
            options: {
                appDir: '<%= pkg.path.src %>js',
                baseUrl: 'lib',
                mainConfigFile: '<%= pkg.path.src %>js/config.js',
                dir: '<%= pkg.path.tmp %>js'
            },
            build: {
                options: {
                    optimize: 'uglify2',
                    // optimize: 'none',
                    paths: {
                        'login': '../page/login',
                        'home': '../page/home'
                    },
                    modules: [{
                        name: 'login',
                        exclude: ['jquery']
                    },{
                        name: 'home',
                        exclude: ['jquery', 'artTemplate']
                    }]
                }
            }
        },

        // 复制
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.src %>images/',
                    src: ['**/*.{png,gif,jpg,jpeg}'],
                    dest: '<%= pkg.path.dist %>images'
                }]
            },
            tmpImages: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.src %>images',
                    src: ['**/*.{png,gif,jpg,jpeg}'],
                    dest: '<%= pkg.path.tmp %>images'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.src %>js',
                    src: ['**/*.js'],
                    dest: '<%= pkg.path.dist %>js'
                }]
            },
            libJs: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.src %>js/lib',
                    src: ['**/*.js'],
                    dest: '<%= pkg.path.dist %>js/lib'
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
                    '<%= pkg.path.src %>js/**/*.js',
                    '!<%= pkg.path.src %>js/config.js',
                    '!<%= pkg.path.src %>js/lib/**/*.js'
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
            css: '<%= pkg.path.tmp %>css/**/*.css',
            js: '<%= pkg.path.tmp %>js/page/**/*.js',
            html: '<%= pkg.path.dist %>html/page/**/*.html'
        },

        // 静态文件hash
        filerev: {
            img: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.path.tmp %>images/',
                    src: [
                        'single/**/*.{png,gif,jpg,jpeg}',
                        'sprite/*.{png,gif,jpg,jpeg}'
                    ],
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
                    src: ['*.js', 'page/**/*.js'],
                    dest: '<%= pkg.path.dist %>js/'
                }]
            }
        },

        // 删除文件
        clean: {
            dist: ['<%= pkg.path.dist %>'],
            tmp: ['<%= pkg.path.tmp %>']
        },

        watch: {
            sass: {
                files: ['<%= pkg.path.src %>sass/**/*.scss'],
                tasks: ['sass:dev']
            },
            js: {
                files: ['<%= pkg.path.src %>js/**/*.js'],
                tasks: ['jshint', 'newer:copy']
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
        'clean:tmp',
        'sass:dev',
        'includereplace:dev',
        'jshint',
        'copy:js',
        'copy:images',
        'watch'
    ]);

    // 打包上线使用
    // 步骤一：对图片进行打包
    grunt.registerTask('img', [
        'clean:dist',
        'clean:tmp',
        'sass:tmp',
        'copy:tmpImages',
        'sprite',
        'imagemin',
        'filerev:img'
    ]);

    // 步骤二：对css进行打包
    grunt.registerTask('css', [
        'usemin:css',
        'sass:dist',
        'filerev:css'
    ]);

    // 步骤三：对js进行打包
    grunt.registerTask('js', [
        'requirejs',
        'usemin:js',
        'filerev:js',
        'copy:libJs'
    ]);

    // // 步骤三：对html进行打包
    grunt.registerTask('html', [
        'includereplace',
        'usemin:html',
        'clean:tmp'
    ]);
};

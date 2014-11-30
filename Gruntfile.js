// Gruntfile.js
module.exports = function(grunt) {

  grunt.initConfig({

    // JS TASKS ================================================================
    // check all js files for errors
    jshint: {
      all: ['public/src/js/**/*.js'] 
    },

    // concat bootstrap
    concat: {
      options: {
        banner: '/*!\n'+
            '* Bootstrap\'s Gruntfile\n'+
            '* http://getbootstrap.com\n'+
            '* Copyright 2013-2014 Twitter, Inc.\n'+
            '* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n'+
            '*/\n\n'+
            'if (typeof jQuery === \'undefined\') {\n'+
            '  throw new Error("Bootstrap\'s JavaScript requires jQuery")\n'+
            '}\n\n'+ 
            '+function ($) {\n'+
            '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')\n'+
            '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {\n'+
            '    throw new Error("Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher")\n'+
            '  }\n'+
            '}(jQuery);\n\n',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'node_modules/bootstrap/js/*.js'
        ],
        dest: 'public/dist/js/bootstrap.js'
      }
    },

		// take all the js files and minify them into app.min.js
    uglify: {
      build: {
        files: {
          'public/dist/js/bootstrap.min.js': 'public/dist/js/bootstrap.js',
          'public/dist/js/app.min.js': ['public/src/js/**/*.js', 'public/src/js/*.js']
        }
      }
    },

    // CSS TASKS ===============================================================
    // process the less file to style.css
    less: {
      build: {
        files: {
          'public/dist/css/bootstrap.css' : 'node_modules/bootstrap/less/bootstrap.less',
          'public/dist/css/style.css': 'public/src/css/style.less'
        }
      }
    },

		// take the processed style.css file and minify
    cssmin: {
      build: {
        files: {
          'public/dist/css/bootstrap.min.css': 'public/dist/css/bootstrap.css',
          'public/dist/css/style.min.css': 'public/dist/css/style.css'
        }
      }
    },

    // COOL TASKS ==============================================================
    // watch css and js files and process the above tasks
    watch: {
      css: {
        files: ['public/src/css/**/*.less'],
        tasks: ['less', 'cssmin']
      },
      js: {
        files: ['public/src/js/**/*.js'],
        tasks: ['jshint', 'uglify']
      }
    },

		// watch our node server for changes
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

		// run watch and nodemon at the same time
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon', 'watch']
    }   

  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['less', 'cssmin', 'jshint', 'concat', 'uglify', 'concurrent']);

  grunt.registerTask('runserver', ['less','cssmin','concat', 'uglify','concurrent']);
};
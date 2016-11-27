module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  // grunt.loadNpmTasks('grunt-babel');

  grunt.initConfig({
    watch: {
      livereload: {
        files: ['./*.html', './js/*.js', './css/*.css'],
        options: {
          livereload: true
        }
      },
      babel: {
        files: ['./js/weather-icon.js'],
        tasks: ['babel']
      }
    },
    express: {
      server: {
        options: {
          bases: ['.']
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['latest']
      },
      dist: {
        files: {
          'js/dist/weather-icon-es5.js': 'js/weather-icon.js'
        }
      }
    }
  });

  grunt.registerTask('serve', ['babel', 'express', 'watch']);
};

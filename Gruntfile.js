module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');

  grunt.initConfig({
    watch: {
      files: ['./*.html', './js/*.js', './css/*.css'],
      options: {
        livereload: true
      }
    },
    express: {
      server: {
        options: {
          bases: ['.']
        }
      }
    }
  });

  grunt.registerTask('serve', ['express', 'watch']);
};

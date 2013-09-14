module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      unit: {
        options: {
          configFile: 'karma.conf.js'
        }
      }
    },
    jshint: {
      all: [
        'Badger.Dashboard/Assets/js/status/*.js', 
        'Badger.Dashboard/Assets/js/status-charts/*.js', 
        'tests/**/*.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['karma']);
};
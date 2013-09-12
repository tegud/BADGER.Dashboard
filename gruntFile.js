module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        files: [{
            expand: true,
            src: '**/*.js',
            dest: 'Badger.Dashboard/Assets/js/src',
            cwd: 'Badger.Dashboard/Assets/js/build'
        }]
      }
    },
  jshint: {
    all: ['Badger.Dashboard/src/*.js', 'tests/**/*.js']
  },
  qunit: {
    all: ['tests/**/*.html']
  }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['uglify']);
};
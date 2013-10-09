module.exports = function(grunt) {
  var files = [
    'Badger.Dashboard/Assets/js/lib/*.js',
    'tests/lib/*.js',
    'Badger.Dashboard/Assets/js/v2/**/*.js',
    'tests/v2/**/*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: files.concat(['*.js']),
        tasks: ['jshint','karma:unit:run']
      }
    },
    karma: {
      unit: {
        options: {
          configFile: 'karma.conf.js',
          files: files,
          background: true
        }
      }
    },
    jshint: {
      all: [
      'tests/v2/**/*.js',
      'Badger.Dashboard/Assets/js/v2/**/*.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['karma']);
};
module.exports = function(grunt) {
  var files = [
    'Badger.Dashboard/Assets/js/lib/*.js',
    'Badger.Dashboard/Assets/js/status/UI/TLRGRP.BADGER.ColorPalette.js',
    'Badger.Dashboard/Assets/js/status/Sources/TLRGRP.BADGER.Cube.js',
    'Badger.Dashboard/Assets/js/status/TLRGRP.BADGER.Dashboard.GraphFactory.js',
    'tests/**/*.html',
    'tests/**/*.js'
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
      'tests/BADGER.Dashboard/**/*.js',
      'Badger.Dashboard/Assets/js/status/TLRGRP.BADGER.Dashboard.GraphFactory.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['karma']);
};
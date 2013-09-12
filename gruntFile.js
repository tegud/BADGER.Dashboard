module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
	  options: {
		sourceMap: 'build/nanoMachine.sourceMap.js',
		sourceMappingURL: 'nanoMachine.sourceMap.js'
	  },
      build: {
        src: 'src/nanoMachine.js',
        dest: 'build/nanoMachine.min.js'
      }
    },
	jshint: {
	  all: ['src/*.js', 'tests/*.js']
	},
	qunit: {
	  all: ['tests/**/*.html']
	}
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);

};
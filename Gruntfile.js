module.exports = function(grunt) {
  grunt.initConfig({
    uncss: {
    dist: {
      files: {
        'css/style.css': ['index.html']
      }
    }
  }
});
  grunt.loadNpmTasks('grunt-uncss');
  grunt.registerTask('default', 'uncss');
}

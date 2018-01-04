/* global module:false */
module.exports = function (grunt) {
  var d = new Date()
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> v<%= pkg.version %> ' +
            '| (c) <%= pkg.author %> | <%= pkg.license %> ' + d.getTime() + ' */',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      common: {
        src: 'src/common.js',
        dest: 'dist/common.js'
      },
      all_users: {
        src: 'src/all_users.js',
        dest: 'dist/all_users.js'
      },
      overview_users: {
        src: 'src/overview_users.js',
        dest: 'dist/overview_users.js'
      },
      overview_percentage: {
        src: 'src/overview_percentage.js',
        dest: 'dist/overview_percentage.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  })

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-qunit')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Default task.
  grunt.registerTask('default', ['qunit', 'concat', 'uglify'])
}

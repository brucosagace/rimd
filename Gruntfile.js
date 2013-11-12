module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: '/js/*.js',
			options: {
				latedef: 'nofunc',
				newcap: true,
				noempty: true,
				undef: true,
				unused: true,
				strict: true,
				onevar: true,
				browser: true, // window, document etc.
				devel: true, // alert, console etc.
				'-W099': false // Mixed tabs and spaces
			}
		},
		qunit: {
			all: ['/js/tests/**/*.html']
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: [
					{
						expand: true,
						cwd: '/js/',
						src: ['rimd.js'],
						dest: '/js/',
						ext: '.min.js'
					}
				]
			} 
		},
		compass: {
			dist: {
				options: {
					config: 'config_prod.rb'
				}
			},
			dev: {
				options: {
					config: 'config.rb'
				}
			}
		}
	}); 

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');

	// Default task(s).
  grunt.registerTask('default', ['jshint', 'qunit', 'uglify', 'compass']);
};

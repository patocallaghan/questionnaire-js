module.exports = function ( grunt ) {

	'use strict';

	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		files: {
			root: '../',
			assets: '<%= files.root %>/assets',
			css: '<%= files.root.assets %>/css',
			scripts: {
				root: '<%= files.assets %>/scripts',
				all: '<%= files.scripts.root %>/**/*.js',
				src: '<%= files.scripts.root %>/src',
				test: '<%= files.scripts.root %>/test'
			}
		},

		connect: {
			server: {
				options: {
					base: '../',
					port: 7778
				}
			}
		},

		watch: {
			options: {
				livereload: true
			},
			files: [
				'<%= files.root %>/**/*.html',
				'<%= files.scripts.root %>/*.js',
				'../assets/css/*.css',
				'<%= files.scripts.src %>/**/*.js',
				'<%= files.scripts.src %>/**/*.json'
			],
			tasks: []
		}

	} );

	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.registerTask( 'default', ['connect', 'watch'] );

};

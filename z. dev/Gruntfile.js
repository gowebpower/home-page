module.exports = function(grunt){
	'use strict';


	// Time how long tasks take. Can help when optimizing build times
 	require('time-grunt')(grunt);

 	// Automatically load required Grunt tasks
 	require('jit-grunt')(grunt);

 	// Configurable paths for the application
    var appConfig = {
	    app: 'app',  // <%= thisProject.app %>
	    build: 'app/build', // <%= thisProject.build %>
	   	root: ''  //<%= appConfig.root %>
    };



	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Project settings
    	thisProject: appConfig,

		connect: {
	        options: {
		        port: 9001,
		        open: true,
		        livereload: 35729,
		       	hostname: 'localhost'
		       	// base: 'app/app2' --  Not sure difference between base and connect.static below.
	        },
	        development: {
	        	options: {
	        		middleware: function(connect){
	        			return [connect.static('app')];
	        		}
	        	}
	        }
		    
		},



		uglify: {
			//vendor | other library.
			// vendor: {  
			// 	'<%= thisProject.build %>/js/vendor.min.js': ['<%= thisProject.app %>/js/vendor/{,*/}*.js']
			// },
			myApp:{
				//myApp | my custom js.
				files: {  
					'<%= thisProject.build %>/js/app.min.js': ['<%= thisProject.app %>/js/{,*/}*.js','!<%= thisProject.app %>/js/vendor/*.js']
				}
			}
		},

		

	    // ng-annotate tries to make the code safe for minification automatically
	    // by using the Angular long form for dependency injection.
	    // ngAnnotate: {
	    //   dist: {
	    //     files: [{
	    //       expand: true,
	    //       cwd: '.tmp/concat/scripts',
	    //       src: '*.js',
	    //       dest: '.tmp/concat/scripts'
	    //     }]
	    //   }
	    // },

		// Make sure code styles are up to par and there are no obvious mistakes
	    jshint: {
	      options: {
	        jshintrc: '.jshintrc',
	        reporter: require('jshint-stylish')
	      },
	      all: {
	        src: [
	          'Gruntfile.js',
	          '<%= thisProject.app %>/js-notyet/{,*/}*.js'
	        ]
	      }
	      // test: {
	      //   options: {
	      //     jshintrc: 'test/.jshintrc'
	      //   },
	      //   src: ['test/spec/{,*/}*.js']
	      // }
	    },


	    // Compiles Sass to CSS and generates necessary files if requested
	    compass: {
	      

	       build: {
		      	options: {
			        sassDir: '<%= thisProject.app %>/sass',
			        cssDir: '<%= thisProject.build %>/css',
			        httpPath: '/',
			        javascriptsDir: '<%= thisProject.app %>/js',
			        fontsDir: '<%= thisProject.app %>/sass/fonts',
			        imagesPath: '<%= thisProject.app %>/images',
			        httpImagesPath: '<%= thisProject.app %>/images',
			        generatedImagesDir: '<%= thisProject.app %>/images',
			        generatedImagesPath: '<%= thisProject.app %>/images',
			        httpGeneratedImagesPath: '<%= thisProject.app %>/images',
			        spriteLoadPath: '<%= thisProject.app %>/images',
			        relativeAssets: true,
			        sourcemap: true
			        // // httpFontsPath: '/css/fonts',
	     	 	}
	     	},

	        buildConfig: {  
	      		options: {
		        	config: '<%= thisProject.app %>/config.rb'
		   		}
	        }

	    },


	    // Run some tasks in parallel to speed up the build process
	    concurrent: {

	      css: [
	        'compass:buildConfig'
	      ],
	      js: [
	        'newer:uglify'
	      ],
	      live: [ 
	      	'compass:buildConfig','uglify'  
	      ]

	    },

	    watch: {

	    	// bower: {
		    //     files: ['bower.json'],
		    //     tasks: ['wiredep']
		    // },
	    	
		    js: {
			    files: ['<%= thisProject.app %>/js/{,*/}*.js'],
			    tasks: ['concurrent:js'],
			    options: {
	    			livereload: '<%= connect.options.livereload %>'
	    		},
		    },

		    compass: {
		        files: ['<%= thisProject.app %>/sass/{,*/}*.{scss,sass}'],
		        tasks: ['concurrent:css']
		    },

		    gruntfile: {
		        files: ['Gruntfile.js']
		    },
			 

		    livereload: {
		    	files: ['<%= thisProject.app %>/*.html', '<%= thisProject.app %>/views/{,*/}*.html', '<%= thisProject.app %>/directives/{,*/}*.html', '<%= thisProject.build %>/css/{,*/}*.css', '<%= thisProject.build %>/js/{,*/}*.js'],
		    	options: {
		    		livereload: '<%= connect.options.livereload %>'
		    	},
		    }
		}

	});

	
	// No need this cus I already ran 'jit-grunt'
	// grunt.loadNpmTasks('<pkg name>');
 	

 	// for the developing app
	grunt.registerTask('serve', 'start a connect web server and watch files', function () {

		// grunt.log.write(target);
	     grunt.task.run([
	      'connect:development',	
	      'watch'
	    ]);

	});


	// for the live ready code or compile all files.
	grunt.registerTask('live', 'Compile Everything CSS & JS', function () {

		grunt.task.run([
	   	   
	      'concurrent:live'
		 // concan JS & CSS 

	    ]);
  	});

};
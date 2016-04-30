module.exports = function (grunt) {

	grunt.loadTasks("../../tasks");

	grunt.initConfig({

		systemjs_builder: {
			demo: {
				options: {
					configFile: "src/main/javascript/config.js",
					minify: false,
					sfx: false
				},
				files: [{
					src: "app/demo/app.js",
					dest: "src/main/javascript/min/demo/demo.min.js"
				}]
			}
		}
	});

	grunt.registerTask("default", ["systemjs"]);
};



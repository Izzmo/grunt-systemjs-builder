var Builder = require('systemjs-builder')

module.exports = function (grunt) {
	'use strict';

	function task() {
		var buildQuickSettings = ['minify', 'sourceMaps'],
			options = _getOptions.call(this, buildQuickSettings),
			builder = new Builder(options.builder),
			done = this.async();

		if (options.baseURL) {
			grunt.verbose.writeln('systemjs-builder-task - using base url: ' + options.baseURL);
			builder.config({ baseURL: options.baseURL });
		}

		if (options.configFile) {
			var ignoreBaseUrlInConfFile = !!options.baseURL;
			builder.loadConfig(options.configFile, false, ignoreBaseUrlInConfFile)
				.then(_build.bind(this, builder, options, done))
				.catch(function (err) {
					grunt.fail.fatal(err);
				});
		}
		else
			_build.call(this, builder, options, done);
	}

	function _getOptions(buildQuickSettings) {

		var options = this.options({
			builder: {},
			build: {},
			sfx: false,
			minify: false,
			sourceMaps: true
		});

		buildQuickSettings.forEach(function (setting) {
			if (undefined === options.build[setting] && undefined !== options[setting])
				options.build[setting] = options[setting];
		});

		return options;
	}

	function _build(builder, options, done) {

		var buildMethod = options.sfx ? 'buildStatic' : 'bundle',
			counter = this.files.length,
			data = {
				builder: builder,
				buildMethod: buildMethod,
				options: options
			};

		grunt.verbose.writeln('systemjs-builder-task - running build method: ' + buildMethod);

		this.files.forEach(_buildSource.bind(this, data, function () {
			if (--counter === 0)
				done();
		}));
	}

	function _buildSource(data, done, file) {
		if (file.src.length > 1)
			grunt.fail.fatal('systemjs-builder-task - only one file allowed to be processed at one time.');

		var builder = data.builder,
				options = data.options,
				src = file.src[0] || file.orig.src[0];

		grunt.verbose.writeln('systemjs-builder-task - about to build source: ' + src);

		builder[data.buildMethod].call(builder, src, file.dest, options.build)
			.then(function () {
				grunt.verbose.writeln('systemjs-builder-task - finished building source: ' + src);
				done();
			})
			.catch(function (err) {
				grunt.fail.fatal(err);
			});
	}

	grunt.registerMultiTask('systemjs_builder', 'Use SystemJS Builder to build javascript packages.', task);
};

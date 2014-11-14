(function () {
	"use strict";

	var
		gulp = require("gulp"),
		jshint = require("gulp-jshint"),
		jhStylish = require("jshint-stylish"),
		chokidar = require("glob-chokidar"),
		uglify = require('gulp-uglify'),
		rename = require("gulp-rename"),
		chalk = require("chalk"),
		fs = require("fs"),
		jshintrc = JSON.parse(fs.readFileSync("./.jshintrc", "utf-8")),
		paths = {
			js: {
				listen: ["js/**/*.js"],
				dest: "js/"
			}
		};

	/* Scripts */

	gulp.task("jswatch", function() {
		chokidar(paths.js.listen, function(ev, path) {
			console.log("[" + chalk.green("glob-chokidar") + "] File event '" + chalk.cyan(ev) + "' in file: " + chalk.magenta(path));


			gulp.src(path, { base: './src/js/' })
				.pipe(jshint(jshintrc))
				.pipe(jshint.reporter(jhStylish))
				.pipe(gulp.dest(paths.js.dest));
		});
	});

	gulp.task("buildjs", function() {
		gulp.src([paths.js.dest + '/*.js', '!' + paths.js.dest + '/*.min.*'])
			.pipe(gulp.dest(paths.js.dest))
			.pipe(uglify({
				compress: {
					dead_code: true,
					global_defs: {
						DEBUG: false
					}
				}
			}))
			.pipe(rename(function(path) {
			  path.extname = '.min.js'
			}))
			.pipe(gulp.dest(paths.js.dest));
	});

	gulp.task("watch", ["jswatch"]);

	gulp.task("default", ["watch"]);

	gulp.task("build", ["buildjs"]);
})();
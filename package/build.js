//constants
var R = require ('ramda');
var path = require ('path');
var jsdom = require ('jsdom');
var frames_src = require ('./build/config') .path .frames .src;
var res_src = require ('./build/config') .path .res .src;
var merges_src = require ('./build/config') .path .merges .src;
var transforms_src = require ('./build/config') .path .transforms .src;
var res_dist = require ('./build/config') .path .res .dist;
var add_on_src = require ('./build/config') .path .add_on .src;
var pages_src = require ('./build/config') .path .pages .src;
var pages_dist = require ('./build/config') .path .pages .dist;
				
				
//utils
var fs = require ('fs-extra');
var files =	require ('./build/util') .files;
var file = require ('./build/util') .file;
var write =	require ('./build/util') .write;
var time = require ('./build/util') .time;
var all_files =	function (dir) {
					var results = [];
					var list = fs .readdirSync (dir);
					list .forEach (function (file) {
						file = path .join (dir, file);
						var stat = fs .statSync (file);
						results .push (file);
					});
					return results;
				}
var files_not =	function (extensions) {
				return	function (dir) {
							var results = [];
							var list = fs .readdirSync (dir);
							list .forEach (function (file) {
								file = path .join (dir, file);
								var stat = fs .statSync (file);
								if (! extensions .some ((extension) => file .endsWith (extension)))
									results .push (file);
							});
							return results;
						}
			};


//domain functions

var frame_string = function (_) {
	return file (path .join (frames_src, _ + '.html'));
}					


//build
time ('build', function () {
	var add_on = file (add_on_src);
	
	fs .readdirSync (res_dist) .forEach (function (file) {
		const file_path = path .resolve (res_dist, file);
		const file_info = fs .statSync (file_path);
		
		if (file_info .isDirectory ())
			fs .removeSync (path .resolve (res_dist, file))
		else
			fs .unlinkSync (path .resolve (res_dist, file))
	});
	files_not (['.html'/*, '.html'*/]) (res_src)
		.forEach (function (path_/* of file*/) {
			var name = path_ .split ('/') .reverse () [0];
			var dest_path = path .join (res_dist, name);
			fs .copySync (path_, dest_path);
		});
	all_files (merges_src)
		.forEach (function (path_/* of file*/) {
			var name = path_ .split ('/') .reverse () [0];
			var dest_path = path .join (res_dist, name);
			fs .copySync (path_, dest_path);
		});
	files ('.js') (pages_src)
		.forEach (function (_path) {
			var relative_path = _path .slice (pages_src .length + 1);
			var name =	relative_path
							.split ('/') .join ('-')
							.split ('.') [0];
										
			time ('rendering ' + name, function () {

				
				var src = file (_path);
				
				var x = frame_string (name);
				var i = x .indexOf ('</body>');
				if (i === -1)
					x = x + add_on + '<script>' + src + '</script>';
				else
					x = x .slice (0, i) + add_on + '<script>' + src + '</script>' + x .slice (i);
				
				write (path .join (pages_dist, name + '.html')) (x);
			})
		})
	files ('.js') (transforms_src)
		.forEach (function (_path) {
			var relative_path = _path .slice (transforms_src .length + 1);
			var name =	relative_path
							.slice (0, - ('.js' .length));
			if (name !== '*.html') {
				var object_path/* of transform */ = path .join (pages_dist, name);
											
				time ('transforming ' + name, function () {
					var transform = require (_path);
					var source = file (object_path);
					write (object_path) (transform (source));
				})
			}
		})
	if (fs .existsSync (path .join (transforms_src, '*.html.js'))) {
		time ('transforming *.html', function () {
			var transform = require (path .join (transforms_src, '*.html.js'));
			files ('.html') (pages_dist)
				.forEach (function (object_path) {
					var relative_path = object_path .slice (pages_dist .length + 1);
					console .log ('transforming', relative_path);

					var source = file (object_path);
					write (object_path) (transform (source));
				})
		})
	}
});
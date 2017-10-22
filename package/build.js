//constants
var R = require ('ramda');
var path = require ('path');
var jsdom = require ('jsdom');
var frames_src = path .join (__dirname, '/../src/frames');
var res_src = path .join (__dirname, '/../src/frames');
var merges_src = path .join (__dirname, '/../src/merges');
var transforms_src = path .join (__dirname, '/../src/transforms');
var res_dist = path .join (__dirname, '/../dist');
var add_on_src = path .join (__dirname, '/../src/add_on.html');
var pages_src = path .join (__dirname, '/../src/ui');
var pages_dist = path .join (__dirname, '/../dist');
				
				
//utils
var fs = require ('fs-extra');
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
var files =	function (extension) {
				return	function (dir) {
							var results = [];
							var list = fs .readdirSync (dir);
							list .forEach (function (file) {
								file = path .join (dir, file);
								var stat = fs .statSync (file);
								if (stat && stat .isDirectory ())
									results = results .concat (files (extension) (file));
								else if (file .endsWith (extension))
									results .push (file);
							});
							return results;
						}
			};
var file =	function (path) {
				return fs .readFileSync (path) .toString ();
			};
var write =	function (path) {
				return	function (string) {		
							fs .outputFileSync (path, string);
						}
			};
var time =	function (name, what) {
				var start = new Date ();
				try {
					var x = what ();
					console .log (name, 'took', (new Date () - start) / 1000, 's');
				}
				catch (e) {
					if (! (e && e .reported)) {
						console .log (name, 'failed', (new Date () - start) / 1000, 's');
					}
					else {
						console .log (name, 'failed', (new Date () - start) / 1000, 's', e);
						if (e)
							e .reported = true;
					}
					throw e;
				}
				return x;
			};


//domain functions

var frame_string = function (_) {
	/*try {
		return file (path .join (frames_src, _ + '/index.html')) .split ('styles.css') .join (_ + '/styles.css');
	}
	catch (e) {*/
		return file (path .join (frames_src, _ + '.htm'));
	//}
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
	files_not (['.htm'/*, '.html'*/]) (res_src)
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
					var source = file (object_path);
					write (object_path) (transform (source));
				})
		})
	}
});
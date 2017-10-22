var path = require ('path');

var base_path = path .join (__dirname, '/../..');

module .exports = {
	path: {
		frames: {
			src: path .join (base_path, '/src/frames')
		},
		res: {
			src: path .join (base_path, '/src/frames'),
			dist: path .join (base_path, '/dist')
		},
		merges: {
			src: path .join (base_path, '/src/merges')
		},
		transforms: {
			src: path .join (base_path, '/src/transforms')
		},
		add_on: {
			src: path .join (base_path, '/src/add_on.html')
		},
		pages: {
			src: path .join (base_path, '/src/ui'),
			dist: path .join (base_path, '/dist')
		}
	}
}
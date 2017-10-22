//constants
var R = require ('ramda');
var path = require ('path');
var fs = require ('fs-extra');

var scrape = require ('website-scraper');

var frames_src = require ('./build/config') .path .frames .src;

				
var scrape_ = function (page, url) {
	console .log ('scraping', page, 'from', url);
	
	fs .removeSync (page);	
	fs .mkdirSync (page);	
	process .chdir (page);	

	return scrape ({
		urls: [ url ],
		filenameGenerator: 'byType',
		directory: page,
		sources: [
			{ selector: 'img', attr: 'src' },
			{ selector: 'link[rel="stylesheet"]', attr: 'href' },
			{ selector: 'script', attr: 'src' },
			{ selector: 'img[anima-src]', attr: 'anima-src' }
		],
		subdirectories: null,
		defaultFilename: '../' + page + '.html'
	})
	.catch (function (e) {
		console .error (e, e .stack);
	})
	.then (function () {
		fs .copySync ('./', '../');
		fs .removeSync (page);
		fs .unlinkSync (page + '.html');
		process .chdir ('..');
	})
};

process .chdir (frames_src);

process .argv .slice (2) .map (function (url) {
	var page = url .split ('/') .reverse () [0];
	return [page, url];
}) .reduce (function (prev, curr) {
	return prev .then (function () {
		return scrape_ (curr [0], curr [1])
			.catch (function (e) {
				console .error (e, e .stack);
			})
	})
}, Promise .resolve ())
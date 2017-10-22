var R = require ('ramda');

module .exports = function (str) {
    return str .replace (/(<[^/>]+)(>)<div class=(?:meta|"widget\d+")>((?!<\/div>).*)<\/div>/g, function (match, open, opening, meta) {
        return open + ' ' + meta + opening;
    }) .replace (/<div class=(?:meta|"widget\d+")>((?!<\/div>).*)<\/div>(<[^/>]+)(>)/g, function (match, meta, open, opening) {
        return open + ' ' + meta + opening;
    });
};
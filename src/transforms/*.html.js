var R = require ('ramda');

var escape_regex = function (str) {
  return str .replace (/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

module .exports = function (str) {
    var metas = {};
    str = str .replace (/\.([^{]+){meta:([^;]+);/g, function (match, class_, meta) {
        meta = meta .split ('“') .join ('"') .split ('”') .join ('"');
        metas [class_] = meta;
        console .log (class_, '|' , meta);
        return match;
    });
    [metas] .map (
        R .forEachObjIndexed (function (meta, class_) {
            var class_matcher = new RegExp ('(<div[^>/]* class="(?:[^"]* )?' + class_ + '(?: [^"]*)?"[^>/]*)(>)', 'g');
            str = str .replace (class_matcher, function (match, begin, end) {
                //console .log (class_, '|' , begin + ' ' + meta + end);
                return begin + ' ' + meta + end;
            })
        }));
    return str;
};
var R = require ('ramda');

module .exports = function (str) {
    return str .replace (/(class=")([^"]+)(")/g, function (match, before, classes, after) {
        var class_list = classes .split (' ');
        var partition = R .partition (function (s) {
            return s .indexOf ('as-') !== -1
        }) (class_list);
        var new_attributes = '';
        if (partition [0] .length) {
            partition [0] .forEach (function (class_) {
                var slice = class_ .split ('as-');
                if (slice [0])
                    new_attributes += (' ' + 'id="' + slice [0] + '"');
                slice .slice (1) .forEach (function (attr) {
                    var partition = attr .split ('-of-');
                    if (partition .length === 1)
                        new_attributes += (' ' + attr);
                    else {
                        var attr_name = partition [0];
                        var attr_value = partition .slice (1) .join ('-of-');
                        new_attributes += (' ' + attr_name + '-"' + attr_value + '"');
                    }
                })
            });
        }
        return before + class_list .join (' ') + after + new_attributes;
    });
};
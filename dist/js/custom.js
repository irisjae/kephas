var frag = function (html) {
	var container = document .createElement ('template');
	container .innerHTML = html;
	return container .content;
}; 
var replace_inplace = function (_, x) {
    _ .parentNode .insertBefore (x, _);
    _ .parentNode .removeChild (_);
    return x;
}
var input_ify = function (div) {
    var x = document .createElement ('input');
    
	[] .forEach .call (div .attributes, function (attr) {
		return x .setAttribute (attr .nodeName, attr .nodeValue);
	})
	
	x .style .outline = x .style .outline || 'none';
	x .style .border = x .style .border || 'none';
	x .style .padding = x .style .padding || '0px';
	x .style .margin = x .style .margin || '0px';
	x .style .background = x .style .background || 'transparent';
	x .style ['-webkitAppearance'] = x .style ['-webkitAppearance'] || 'none';
	x .style .display = x .style .display || 'block';
	x .placeholder = div .textContent;
	
	return x;
};
var textarea_ify = function (div) {
    var x = document .createElement ('textarea');
    
	[] .forEach .call (div .attributes, function (attr) {
		return x .setAttribute (attr .nodeName, attr .nodeValue);
	})
	
	x .style .outline = x .style .outline || 'none';
	x .style .border = x .style .border || 'none';
	x .style .padding = x .style .padding || '0px';
	x .style .margin = x .style .margin || '0px';
	x .style .background = x .style .background || 'transparent';
	x .style ['-webkitAppearance'] = x .style ['-webkitAppearance'] || 'none';
	x .style .display = x .style .display || 'block';
	x .placeholder = div .textContent;
	
	return x;
};
var dropdown_ify = function (div/*, menu*/) {
    var x = div .cloneNode (true);
    var y = frag ('<div class="dropdown-menu dropdown-menu-right"> <h6 class="dropdown-header">Dropdown header</h6> <a class="dropdown-item" href="#">Action</a> <a class="dropdown-item" href="#">Another action</a> </div>');
    
    y .lastElementChild .style .fontFamily = '\'HelveticaNeue\',Helvetica,Arial,serif';
    
	x .style .userSelect = 'none';
    x .style .cursor = 'pointer';    
    x .setAttribute ('bootstrap', '');
    x .append (y);

    var menu = x .lastElementChild;
    click (x, function (e) {
    	if (! e .target .closest ('.dropdown-menu')) {
	        if (window .getComputedStyle (menu) .display === 'none')
	            menu .style .display = 'unset'
	        else
	            menu .style .display = 'none'
    	}
    });

	return x;
};

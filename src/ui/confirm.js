var _interaction_ = function (components, unions) {
	var message = components .message;
	var send = components .send;

	var confirm = components .confirm;
	
	var stepper = components .stepper;
	
	var extension = interaction (transition (function (intent, license) {
	    if (intent [0] === 'confirm')
	        return function (tenure) {
	            stepper .intent ({
	                _payment: true
	            })
	            tenure ('confirmed');
	            tenure .end (true);
	        }
	   else
	        return decline_ (intent);
	}))
	
	stepper .intent ({
	    _uploads: true
	});
	confirm .thru (tap, function () {
	    extension .intent (['confirm'])
	});
};




var dom = document;


//SCHEMA: date, person, message
var api_conversation = stream ();

var account_dom = document .querySelector ('.my-account');
    account_dom = replace_inplace (account_dom, dropdown_ify (account_dom));
var help_dom = document .querySelector ('.help');
    help_dom = replace_inplace (help_dom, dropdown_ify (help_dom));
var search_dom = document .querySelector ('.click-to-search-here');
    search_dom = replace_inplace (search_dom, input_ify (search_dom));
var show_more_dom = document .querySelector ('.show-more');
    show_more_dom = replace_inplace (show_more_dom, dropdown_ify (show_more_dom));
var message_dom = document .querySelector ('.label3');
    message_dom = replace_inplace (message_dom, textarea_ify (message_dom))

var send_dom = document .querySelector ('[uploads] [action]');
var send_stream = stream_from_click_on (send_dom);
var confirm_dom = document .querySelector ('#confirm-[action]');
var confirm_stream = stream_from_click_on (confirm_dom);


var stepper_cases = {
    _payment: '[payment]',
    _uploads: '[uploads]'
};


var _interaction = _interaction_ ({
	message: interaction_input (message_dom),
	send: send_stream,
	confirm: confirm_stream,
	stepper: interaction_case (stepper_cases)
})